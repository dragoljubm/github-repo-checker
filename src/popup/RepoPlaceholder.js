import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setFocusedRepo } from "./actions";
import { setValueToChromeStorage } from "../utils";

const RepoPlaceholder = ({ url, alias }) => {
  const nUnreadCommits = useSelector(({ repositories }) => {
    if (repositories[url]) return repositories[url].nUnreadCommits;
    else return 0;
  });
  const repo_placeholder_color = useSelector(
    (state) => state.repo_placeholder_color
  );
  const new_commit_color = useSelector((state) => state.new_commit_color);
  const text_color = useSelector((state) => state.text_color);

  const dispatch = useDispatch();

  return (
    <div
      style={{
        backgroundColor: repo_placeholder_color,
        color: text_color,
      }}
      className="repoPlaceholder"
      onClick={async (e) => {
        dispatch(setFocusedRepo(url));
        setValueToChromeStorage("focused_repo", url);
      }}
    >
      {!!nUnreadCommits && (
        <div
          className="notification"
          style={{ backgroundColor: new_commit_color }}
        />
      )}
      <div title={alias} className="alias">
        {alias}
      </div>
    </div>
  );
};

export default RepoPlaceholder;
