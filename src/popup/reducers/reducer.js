import {
  SET_FOCUSED_REPO,
  POPUP_DATA_LOADED,
  SET_ALL_REPOS_DATA,
  SET_FOCUSED_REPO_DATA,
  RESET_FOCUSED_REPO_UNREAD_COMMITS,
} from "../actions";
import axios from "axios";
import { getObjectFromChromeStorage } from "../../utils";
import {
  processCommits,
  extractOwnerSlashRepo,
  calculateUnreadCommits,
} from "../../utils.js";

const API = axios.create({
  baseURL: `https://api.github.com/repos/`,
});

const initialState = {
  repositories: {},
  focused_repo: "",
  popup_background_color: "#292a2d",
  text_color: "#f1f1f1",
  repo_placeholder_color: "#2d9bf0",
  new_commit_color: "#f0822d",
};

export default function rootReducer(state = initialState, action) {
  switch (action.type) {
    case POPUP_DATA_LOADED: {
      return {
        ...state,
        ...action.payload,
      };
    }
    case SET_FOCUSED_REPO_DATA: {
      let focused_repo = state.focused_repo;
      return {
        ...state,
        repositories: {
          ...state.repositories,
          [focused_repo]: {
            ...state.repositories[focused_repo],
            commits: action.payload,
          },
        },
      };
    }
    case SET_ALL_REPOS_DATA:
      return {
        ...state,
        repositories: action.payload,
      };
    case SET_FOCUSED_REPO:
      return {
        ...state,
        focused_repo: action.payload,
      };
    case RESET_FOCUSED_REPO_UNREAD_COMMITS: {
      return {
        ...state,
        repositories: {
          ...state.repositories,
          [action.payload]: {
            ...state.repositories[action.payload],
            nUnreadCommits: 0,
          },
        },
      };
    }
    default:
      return state;
  }
}

export async function fetchFocusedRepoData(dispatch, getState) {
  const focusedRepoUrl = getState().focused_repo;
  const focusedRepoCommits = getState().repositories[focusedRepoUrl].commits;
  const ownerSlashRepo = extractOwnerSlashRepo(focusedRepoUrl);
  API.get(`${ownerSlashRepo}/commits?per_page=5`)
    .then((result) => {
      if (!result.data || result.status === "rejected") return; // better error handling in the future, i promise!
      let fetchedCommits = processCommits(result.data);
      dispatch({ type: SET_FOCUSED_REPO_DATA, payload: fetchedCommits });
      chrome.storage.local.get("repositories", ({ repositories }) => {
        let newRepoData = {
          ...repositories,
          [focusedRepoUrl]: {
            ...repositories[focusedRepoUrl],
            commits: fetchedCommits,
            nUnreadCommits: calculateUnreadCommits(
              focusedRepoCommits,
              fetchedCommits
            ),
          },
        };
        chrome.storage.local.set({ repositories: newRepoData });
      });
    })
    .catch(() => {});
}

export async function fetchAllReposData(dispatch, getState) {
  const repoUrls = Object.keys(getState().repositories);
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
      let newRepositoriesState = getState().repositories;
      results.forEach((result, index) => {
        if (!result.value || result.status === "rejected") return; // better error handling in the future, i promise!
        let fetched_commits = processCommits(result.value);
        let repoURL = repoUrls[index];
        let old_commits = getState().repositories[repoURL].commits;
        newRepositoriesState = {
          ...newRepositoriesState,
          [repoURL]: {
            ...newRepositoriesState[repoURL],
            commits: fetched_commits,
            nUnreadCommits: calculateUnreadCommits(
              old_commits,
              fetched_commits
            ),
          },
        };
      });
      dispatch({ type: SET_ALL_REPOS_DATA, payload: newRepositoriesState });
      chrome.storage.local.set({ repositories: newRepositoriesState });
    })
    .catch((err) => {
      console.log(err);
    });
}

export const resetFocusedRepoUnreadCommitsToStorage = (url) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: RESET_FOCUSED_REPO_UNREAD_COMMITS,
    payload: url,
  });
  chrome.storage.local.get("repositories", ({ repositories }) => {
    let newRepoData = {
      ...repositories,
      [url]: {
        ...repositories[url],
        nUnreadCommits: 0,
      },
    };
    chrome.storage.local.set({ repositories: newRepoData });
  });
};

export async function fetchPopupData(dispatch, getState) {
  const repositories = await getObjectFromChromeStorage("repositories");
  const {
    repo_placeholder_color,
    popup_background_color,
    new_commit_color,
    text_color,
  } = await getObjectFromChromeStorage("settings");
  const colorSettings = {
    repo_placeholder_color,
    popup_background_color,
    new_commit_color,
    text_color,
  };
  const popup_data = { repositories, ...colorSettings };
  dispatch({ type: POPUP_DATA_LOADED, payload: popup_data });
}
