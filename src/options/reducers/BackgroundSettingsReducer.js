import {
  SET_BACKGROUND_CHECKING,
  SET_BACKGROUND_CHECK_INTERVAL,
  SET_DESKTOP_NOTIFICATIONS,
  BACKGROUND_SETTINGS_LOADED,
} from "../actions";
import { getObjectFromChromeStorage } from "../../utils";

const initialState = {
  background_checking: false,
  background_checking_interval: 5,
  desktop_notifications: false,
};

export default function backgroundSettingsReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case SET_BACKGROUND_CHECKING:
      return {
        ...state,
        background_checking: action.payload,
      };
    case SET_BACKGROUND_CHECK_INTERVAL:
      return {
        ...state,
        background_checking_interval: action.payload,
      };
    case SET_DESKTOP_NOTIFICATIONS:
      return {
        ...state,
        desktop_notifications: action.payload,
      };
    case BACKGROUND_SETTINGS_LOADED:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

export async function fetchBackgroundSettings(dispatch, getState) {
  const {
    background_checking,
    background_checking_interval,
    desktop_notifications,
  } = await getObjectFromChromeStorage("settings");
  const backgroundSettings = {
    background_checking,
    background_checking_interval,
    desktop_notifications,
  };
  dispatch({ type: BACKGROUND_SETTINGS_LOADED, payload: backgroundSettings });
}
