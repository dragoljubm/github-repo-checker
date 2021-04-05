import React from "react";
import RepoSettings from "./RepoSettings";
import BackgroundSettings from "./BackgroundSettings";
import ColorSettings from "./ColorSettings";

const App = () => {
  return (
    <div id="container">
      <RepoSettings />
      <BackgroundSettings />
      <ColorSettings />
    </div>
  );
};

export default App;
