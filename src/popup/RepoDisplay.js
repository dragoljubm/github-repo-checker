import React from "react";
import { useSelector } from "react-redux";
import RepoPlaceholder from "./RepoPlaceholder";
import ExpandedRepo from "./ExpandedRepo";

const RepoDisplay = () => {
  const focused_repo = useSelector(({ focused_repo }) => focused_repo);
  const repositories = useSelector(({ repositories }) =>
    Object.values(repositories).sort((a, b) => a.index - b.index)
  );
  const focused_repo_data = useSelector(({ repositories }) => {
    if (focused_repo != "") {
      return repositories[focused_repo];
    }
  });
  const nUnreadCommits = useSelector(({ focused_repo, repositories }) => {
    if (focused_repo != "") {
      return repositories[focused_repo].nUnreadCommits || 0;
    }
  });

  const isRepoFocused = focused_repo != "";

  return isRepoFocused ? (
    <div className="repoPlaceholderContainer">
      <ExpandedRepo
        focused_repo_data={focused_repo_data}
        nUnreadCommits={nUnreadCommits}
      />
    </div>
  ) : (
    <div className="repoPlaceholderContainer">
      {repositories.map((repo) => {
        if (repo.repoURL != "") {
          return (
            <RepoPlaceholder
              url={repo.repoURL}
              alias={repo.repoAlias}
              key={repo.repoURL}
            />
          );
        }
      })}
    </div>
  );
};

export default RepoDisplay;
