import React from "react";
import { openOptionsPage } from "../utils";

const GoToOptions = () => {
  return (
    <div className="go-to-options">
      <div className="celavo-kuce-frodo"></div>
      Head to the options page to add a repository
      <img
        src="../options.svg"
        className="go-to-options-img"
        onClick={(e) => openOptionsPage()}
      ></img>
    </div>
  );
};

export default GoToOptions;
