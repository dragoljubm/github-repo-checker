export function extractOwnerSlashRepo(github_url) {
  const owner = github_url.slice(19, github_url.indexOf("/", 19));
  const repo = github_url.slice(github_url.indexOf("/", 19) + 1);
  return `${owner}/${repo}`;
}

export function processCommits(response) {
  let array = response.map((info) => {
    const date = processDate(info.commit.author.date);
    return {
      author: info.commit.author.name,
      date,
      message: info.commit.message,
      url: info.html_url,
    };
  });
  return array;
}

export function openOptionsPage() {
  chrome.runtime.openOptionsPage();
}

export function calculateUnreadCommits(oldCommits, fetchedCommits) {
  if (oldCommits == undefined || !oldCommits.length)
    return fetchedCommits.length;
  let newCommits = fetchedCommits
    .map((commit) => commit.date)
    .indexOf(oldCommits[0].date);
  return newCommits == -1 ? fetchedCommits.length : newCommits;
}

function processDate(dateString) {
  return new Date(dateString).toLocaleString("en-GB", { hour12: false });
}

export function getObjectFromChromeStorage(value_key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(value_key, (result) => {
      resolve(result[value_key]);
    });
  });
}

export function setValueToChromeStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, (result) => {
      resolve();
    });
  });
}

export async function savePrimitiveSetting(key, value) {
  let result = await getObjectFromChromeStorage("settings");
  let new_settings = {
    ...result,
    [key]: value,
  };
  await setValueToChromeStorage("settings", new_settings);
}

export function openCommitInNewTab(url) {
  chrome.tabs.create({ url, active: false });
}
