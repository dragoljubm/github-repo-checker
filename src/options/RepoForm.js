import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteRepo } from "./actions";

const RepoForm = ({ url, alias, id }) => {
  const dispatch = useDispatch();
  const [temporary_url, setUrl] = useState(url);
  const [temporary_alias, setAlias] = useState(alias);

  return (
    <div className="repoForm">
      <label htmlFor="repoURL">Valid Repository URL: </label>
      <input
        type="text"
        name="repoURL"
        data-id={id}
        value={temporary_url}
        placeholder={"https://github.com/owner/repo"}
        className="repoURL"
        onChange={(e) => {
          e.target.style.border = "none";
          e.target.style.backgroundColor = "#ffffffe6";
          setUrl(e.target.value);
        }}
      ></input>
      <label htmlFor="repoAlias">Alias (preferably short): </label>
      <input
        type="text"
        name="repoAlias"
        value={temporary_alias}
        className="repoAlias"
        onChange={(e) => {
          setAlias(e.target.value);
        }}
      ></input>
      <div
        className="circle"
        onClick={(e) => {
          setUrl("");
          setAlias("");
          dispatch(deleteRepo(url));
        }}
      >
        <div className="before"></div>
        <div className="after"></div>
      </div>
    </div>
  );
};

export default RepoForm;
