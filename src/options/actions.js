export const SET_REPOSITORIES = "SET_REPOSITORIES";
export const SET_REPOSITORY = "SET_REPOSITORY";
export const SET_ALIAS = "SET_ALIAS";
export const SET_BACKGROUND_CHECKING = "SET_BACKGROUND_CHECKING";
export const SET_BACKGROUND_CHECK_INTERVAL = "SET_BACKGROUND_CHECK_INTERVAL";
export const SET_DESKTOP_NOTIFICATIONS = "SET_DESKTOP_NOTIFICATIONS";
export const SET_POPUP_BACKGROUND_COLOR = "SET_POPUP_BACKGROUND_COLOR";
export const SET_REPO_PLACEHOLDER_COLOR = "SET_REPO_PLACEHOLDER_COLOR";
export const SET_NEW_COMMIT_COLOR = "SET_NEW_COMMIT_COLOR";
export const SET_TEXT_COLOR = "SET_TEXT_COLOR";
export const COLOR_SETTINGS_LOADED = "COLOR_SETTINGS_LOADED";
export const SET_REPOSITORY_COUNT = "SET_REPOSITORY_COUNT";
export const INCREMENT_REPO_COUNT = "INCREMENT_REPO_COUNT";
export const DELETE_REPO = "DELETE_REPO";
export const REPOSITORIES_LOADED = "REPOSITORIES_LOADED";
export const BACKGROUND_SETTINGS_LOADED = "BACKGROUND_SETTINGS_LOADED";

export function changeRepository(data) {
  return {
    type: SET_REPOSITORY,
    payload: data,
  };
}

export function changeRepoAlias(data) {
  return {
    type: SET_ALIAS,
    payload: { alias: data.alias },
  };
}

export function incrementRepoFormCount() {
  return { type: INCREMENT_REPO_COUNT };
}

export function deleteRepo(url) {
  return { type: DELETE_REPO, payload: url };
}

export function changeBackgroundChecking(backgroundChecking) {
  return {
    type: SET_BACKGROUND_CHECKING,
    payload: backgroundChecking,
  };
}

export function changeBackgroundCheckInterval(backgroundCheckInterval) {
  return {
    type: SET_BACKGROUND_CHECK_INTERVAL,
    payload: backgroundCheckInterval,
  };
}
export function changeDesktopNotifications(desktopNotifications) {
  return {
    type: SET_DESKTOP_NOTIFICATIONS,
    payload: desktopNotifications,
  };
}

export function changePopupBackgroundColor(color) {
  return {
    type: SET_POPUP_BACKGROUND_COLOR,
    payload: color,
  };
}

export function changeTextColor(color) {
  return {
    type: SET_TEXT_COLOR,
    payload: color,
  };
}

export function changeRepoPlaceholderColor(color) {
  return {
    type: SET_REPO_PLACEHOLDER_COLOR,
    payload: color,
  };
}

export function changeNewCommitColor(color) {
  return {
    type: SET_NEW_COMMIT_COLOR,
    payload: color,
  };
}
