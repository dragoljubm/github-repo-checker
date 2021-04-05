import React from "react";
import { render } from "react-dom";
import App from "./App";
import { Provider } from "react-redux";
import store from "./store";

import { fetchBackgroundSettings } from "./reducers/BackgroundSettingsReducer";
import { fetchRepoArray } from "./reducers/RepositoryListReducer";
import { fetchColorSettings } from "./reducers/ColorSettingsReducer";

store.dispatch(fetchColorSettings);
store.dispatch(fetchBackgroundSettings);
store.dispatch(fetchRepoArray);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
