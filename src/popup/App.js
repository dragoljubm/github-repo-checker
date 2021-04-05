import React from "react";
import { useSelector } from "react-redux";
import RepoDisplay from "./RepoDisplay";
import Buttons from "./Buttons";
import GoToOptions from "./GoToOptions";

const App = () => {
  const popup_background_color = useSelector(
    (state) => state.popup_background_color
  );
  const shouldDisplayGoToOptions = useSelector((state) => {
    for (let prop in state.repositories) return false;
    return true;
  });

  return (
    <div style={{ backgroundColor: popup_background_color }} id="container">
      {shouldDisplayGoToOptions ? (
        <GoToOptions />
      ) : (
        <div style={{ backgroundColor: popup_background_color }} id="container">
          <RepoDisplay />
          <Buttons />
        </div>
      )}
    </div>
  );
};

export default App;
