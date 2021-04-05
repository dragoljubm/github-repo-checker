import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Commit from "./Commit";
import { resetFocusedRepoUnreadCommitsToStorage } from "./reducers/reducer";

const ExpandedRepo = ({ focused_repo_data, nUnreadCommits }) => {
  const repo_placeholder_color = useSelector(
    (state) => state.repo_placeholder_color
  );
  const text_color = useSelector((state) => state.text_color);

  const dispatch = useDispatch();

  const commits = focused_repo_data.commits ?? [];

  useEffect(() => {
    return () => {
      dispatch(
        resetFocusedRepoUnreadCommitsToStorage(focused_repo_data.repoURL)
      );
      chrome.storage.local.set({ focused_repo: "" });
    };
  }, []);

  return (
    <div
      style={{ backgroundColor: repo_placeholder_color, color: text_color }}
      className="expandedRepo"
    >
      Latest 5 commits for <br></br>
      {focused_repo_data.repoURL}
      {commits.map((commit, index) => (
        <Commit
          isNewCommit={index < nUnreadCommits}
          key={index}
          commit={commit}
        />
      ))}
    </div>
  );
};

export default ExpandedRepo;
