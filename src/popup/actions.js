export const SET_FOCUSED_REPO_DATA = "SET_FOCUSED_REPO_DATA";
export const SET_ALL_REPOS_DATA = "SET_ALL_REPOS_DATA";
export const SET_FOCUSED_REPO = "SET_FOCUSED_REPO";
export const POPUP_DATA_LOADED = "POPUP_DATA_LOADED";
export const RESET_FOCUSED_REPO_UNREAD_COMMITS =
  "RESET_FOCUSED_REPO_UNREAD_COMMITS";

export function setFocusedRepo(url) {
  return { type: SET_FOCUSED_REPO, payload: url };
}
