import React from "react";
import { useSelector } from "react-redux";
import { openCommitInNewTab } from "../utils";

const Commit = ({ isNewCommit, commit }) => {
  const new_commit_color = useSelector((state) => state.new_commit_color);
  const text_color = useSelector((state) => state.text_color);
  return (
    <div
      style={{
        borderColor: isNewCommit ? new_commit_color : text_color,
        borderWidth: isNewCommit ? "2px" : "1px",
      }}
      onClick={(e) => openCommitInNewTab(commit.url)}
      className="commit"
      key={commit.date}
      title="Click to open in a new tab"
    >
      <p>{commit.message}</p>
      <p>By: {commit.author}</p>
      <p>{commit.date}</p>
    </div>
  );
};

export default Commit;
