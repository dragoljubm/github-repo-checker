import {
  SET_POPUP_BACKGROUND_COLOR,
  SET_REPO_PLACEHOLDER_COLOR,
  SET_NEW_COMMIT_COLOR,
  SET_TEXT_COLOR,
  COLOR_SETTINGS_LOADED,
} from "../actions";
import { getObjectFromChromeStorage } from "../../utils";

const initialState = {
  popup_background_color: "#292a2d",
  text_color: "#f1f1f1",
  repo_placeholder_color: "#2d9bf0",
  new_commit_color: "#f0822d",
};

export default function colorSettingsReducer(state = initialState, action) {
  switch (action.type) {
    case SET_POPUP_BACKGROUND_COLOR:
      return {
        ...state,
        popup_background_color: action.payload,
      };
    case SET_TEXT_COLOR:
      return {
        ...state,
        text_color: action.payload,
      };
    case SET_REPO_PLACEHOLDER_COLOR:
      return {
        ...state,
        repo_placeholder_color: action.payload,
      };
    case SET_NEW_COMMIT_COLOR:
      return {
        ...state,
        new_commit_color: action.payload,
      };
    case COLOR_SETTINGS_LOADED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export async function fetchColorSettings(dispatch, getState) {
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
  dispatch({ type: COLOR_SETTINGS_LOADED, payload: colorSettings });
}
