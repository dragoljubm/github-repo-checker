import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFocusedRepo } from "./actions";
import { fetchAllReposData, fetchFocusedRepoData } from "./reducers/reducer";

const Buttons = () => {
  const focusedRepo = useSelector((state) => state.focused_repo);
  const isRepoFocused = focusedRepo != "";
  const dispatch = useDispatch();

  return isRepoFocused ? (
    <>
      <div className="bottom-bar">
        <a
          className="custom_button"
          onClick={(e) => {
            e.preventDefault();
            dispatch(fetchFocusedRepoData);
          }}
        >
          Check this repo
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            dispatch(setFocusedRepo(""));
          }}
          className="custom_button"
        >
          Close
        </a>
      </div>
    </>
  ) : (
    <a
      className="custom_button"
      onClick={(e) => {
        e.preventDefault();
        dispatch(fetchAllReposData);
      }}
    >
      Check All
    </a>
  );
};

export default Buttons;
