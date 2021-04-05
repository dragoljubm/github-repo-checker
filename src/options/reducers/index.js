import { combineReducers } from "redux";
import colorSettingsReducer from "./ColorSettingsReducer";
import backgroundSettingsReducer from "./BackgroundSettingsReducer";
import repositoryListReducer from "./RepositoryListReducer";

export default combineReducers({
  colorSettings: colorSettingsReducer,
  backgroundSettings: backgroundSettingsReducer,
  repositorySettings: repositoryListReducer,
});
