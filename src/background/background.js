import axios from "axios";
import {
  processCommits,
  extractOwnerSlashRepo,
  calculateUnreadCommits,
} from "../utils.js";

const API = axios.create({
  baseURL: `https://api.github.com/repos/`,
});

let backgroundCheckTimer;
let repositories;
let backgroundCheckInterval;
let desktopNotificationsEnabled;
let newCommitColor;

init();

async function init() {
  await initData();
  initStorageChangeListeners();
}

async function initData() {
  const settings = await initSettings();

  backgroundCheckInterval =
    settings.background_checking_interval < 10 //temporary fix for being able to manually enter values below 10 even though input min is set to 10
      ? 10
      : settings.background_checking_interval;
  const backgroundChecking = settings.background_checking;

  if (backgroundChecking) {
    backgroundCheckTimer = setInterval(async () => {
      backgroundCheck();
    }, 1000 * 60 * 0.5); //backgroundCheckInterval);
  }

  desktopNotificationsEnabled = settings.desktop_notifications;
  newCommitColor = settings.new_commit_color;

  repositories = await initRepositories();
}

function initSettings() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("settings", ({ settings }) => {
      if (!settings) {
        const defaultSettings = {
          background_checking: false,
          background_checking_interval: 10,
          desktop_notifications: false,
          popup_background_color: "#292a2d",
          text_color: "#f1f1f1",
          repo_placeholder_color: "#2d9bf0",
          new_commit_color: "#f0822d",
        };

        chrome.storage.local.set(
          {
            settings: defaultSettings,
          },
          () => {
            resolve(defaultSettings);
          }
        );
      } else {
        resolve(settings);
      }
    });
  });
}

function initRepositories() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("repositories", ({ repositories }) => {
      if (!repositories) {
        const defaultRepositories = {};
        chrome.storage.local.set(
          {
            repositories: defaultRepositories,
          },
          () => {
            resolve(defaultRepositories);
          }
        );
      } else {
        resolve(repositories);
      }
    });
  });
}

function initStorageChangeListeners() {
  repositoryChangeListener();
  backgroundCheckingChangeListener();
  backgroundCheckIntervalChangeListener();
  desktopNotificationsChangeListener();
  newCommitColorChangeListener();
  unreadCountChangeListener();
  onViolentPopupCloseEdgeCaseListener();
}

function unreadCountChangeListener() {
  chrome.storage.onChanged.addListener((change) => {
    if (change.repositories) {
      const newRepoValues = change.repositories.newValue;
      if (Object.values(newRepoValues).every((repo) => !repo.nUnreadCommits)) {
        chrome.browserAction.setBadgeText({ text: "" });
      }
    }
  });
}

function onViolentPopupCloseEdgeCaseListener() {
  chrome.runtime.onConnect.addListener((port) => {
    port.onDisconnect.addListener((port) => {
      //if the popup closes
      chrome.storage.local.get("focused_repo", ({ focused_repo }) => {
        if (focused_repo) {
          //check if it was closed before pressing the built-in close button that resets focused_repo and unread counts for it
          chrome.storage.local.get("repositories", ({ repositories }) => {
            const isNotEmpty = (repositories) => {
              //the popup may be closed but with no repos set, focused_repo will default to "", do no processing if so
              for (let prop in repositories) return true;
              return false;
            };
            if (isNotEmpty) {
              // set unread counts for the last focused repo
              let newRepoData = {
                ...repositories,
                [focused_repo]: {
                  ...repositories[focused_repo],
                  nUnreadCommits: 0,
                },
              };
              chrome.storage.local.set({ repositories: newRepoData });
              chrome.storage.local.set({ focused_repo: "" });
            }
          });
        }
      });
    });
  });
}

function repositoryChangeListener() {
  chrome.storage.onChanged.addListener((change) => {
    if (change.repositories) {
      repositories = change.repositories.newValue;
    }
  });
}

function newCommitColorChangeListener() {
  chrome.storage.onChanged.addListener((change) => {
    if (
      change.settings &&
      change.settings.newValue.new_commit_color !=
        change.settings.oldValue.new_commit_color
    ) {
      newCommitColor = change.settings.newValue.new_commit_color;
    }
  });
}

function backgroundCheckingChangeListener() {
  chrome.storage.onChanged.addListener((change) => {
    if (
      change.settings &&
      change.settings.newValue.background_checking !=
        change.settings.oldValue.background_checking
    ) {
      clearInterval(backgroundCheckTimer);
      if (change.settings.newValue.background_checking) {
        backgroundCheckTimer = setInterval(async () => {
          backgroundCheck();
        }, 1000 * 60 * backgroundCheckInterval);
      }
    }
  });
}

function backgroundCheckIntervalChangeListener() {
  chrome.storage.onChanged.addListener((change) => {
    if (
      change.settings &&
      change.settings.newValue.background_checking_interval !=
        change.settings.oldValue.background_checking_interval
    ) {
      const newInterval =
        change.settings.newValue.background_checking_interval < 10 //temporary fix for being able to manually enter values below 10 even though input min is set to 10
          ? 10
          : change.settings.newValue.background_checking_interval;
      backgroundCheckInterval = newInterval;
      clearInterval(backgroundCheckTimer);
      backgroundCheckTimer = setInterval(async () => {
        backgroundCheck();
      }, 1000 * 60 * backgroundCheckInterval);
    }
  });
}

function desktopNotificationsChangeListener() {
  chrome.storage.onChanged.addListener((change) => {
    if (
      change.settings &&
      change.settings.newValue.desktop_notifications !=
        change.settings.oldValue.desktop_notifications
    ) {
      desktopNotificationsEnabled =
        change.settings.newValue.desktop_notifications;
    }
  });
}

function backgroundCheck() {
  const repoUrls = Object.keys(repositories);
  const ownersSlashRepos = repoUrls.map((repo) => extractOwnerSlashRepo(repo));

  let promises = ownersSlashRepos.map((token) => {
    return API.get(`${token}/commits?per_page=5`)
      .then((result) => result.data)
      .catch((err) => {
        console.log(err);
      });
  });

  Promise.allSettled(promises)
    .then((results) => {
      let newRepositoriesState = repositories;
      let shouldShowNotification = false;

      results.forEach((result, index) => {
        if (!result.value || result.status === "rejected") return; // better error handling in the future, i promise!
        let fetched_commits = processCommits(result.value);
        let repoURL = repoUrls[index];
        let old_commits = repositories[repoURL].commits;
        let new_commits = calculateUnreadCommits(old_commits, fetched_commits);
        if (new_commits) shouldShowNotification = true; //set to true if at least one repository has new commits

        newRepositoriesState = {
          ...newRepositoriesState,
          [repoURL]: {
            ...newRepositoriesState[repoURL],
            commits: fetched_commits,
            nUnreadCommits:
              /*
                background checking should not decrease unread count
                edge-case : 2 background checks in a row without the user opening the popup
                will result in nUnreadCommits being set to 0 and no notification for the user :(, only the popup should handle
                resetting unread counts 
              */
              new_commits < newRepositoriesState[repoURL].nUnreadCommits
                ? newRepositoriesState[repoURL].nUnreadCommits
                : new_commits,
          },
        };
      });

      //if at least one repository has new commits, set the badge
      if (
        Object.values(newRepositoriesState).some(
          (repo) => repo.nUnreadCommits > 0
        )
      ) {
        chrome.browserAction.setBadgeText({ text: " " });
        chrome.browserAction.setBadgeBackgroundColor({ color: newCommitColor });
      }

      if (desktopNotificationsEnabled && shouldShowNotification)
        notificationHandler(newRepositoriesState);

      chrome.storage.local.set({ repositories: newRepositoriesState });
    })
    .catch((err) => console.log(err));
}

function notificationHandler(repositories) {
  //simply display a message to the user informing about new commits existing,
  //originally planned to display number of commits on a per-repo basis
  //but the notification api is not suited for multiple entry messages
  let reposWithNewCommits = "";
  Object.values(repositories)
    .sort((a, b) => a.index - b.index)
    .forEach((repo, index) => {
      if (repo.nUnreadCommits) {
        const repoAlias = repo.repoAlias ? repo.repoAlias : `Repo ${index + 1}`;
        reposWithNewCommits += repoAlias + ", ";
      }
    });

  //not the most elegant solution
  reposWithNewCommits = reposWithNewCommits.slice(
    0,
    reposWithNewCommits.lastIndexOf(", ")
  );

  if (reposWithNewCommits) {
    chrome.notifications.create("new_commits_notification", {
      type: "basic",
      iconUrl: "./icon.png",
      requireInteraction: true,
      title: "GitHub Repository Checker",
      message: `New commits at ${reposWithNewCommits}`,
    });
  }
}
