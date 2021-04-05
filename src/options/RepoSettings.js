import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import RepoForm from "./RepoForm";
import { getObjectFromChromeStorage, setValueToChromeStorage } from "../utils";
import { incrementRepoFormCount } from "./actions";

const RepoSettings = () => {
  const [saveOutcome, setSaveOutcome] = useState("");

  let repositories = useSelector((state) => {
    return state.repositorySettings.repositories;
  });
  const dispatch = useDispatch();
  const repository_array = Object.values(repositories).sort(
    (a, b) => a.index - b.index
  );
  const repositoryCount = useSelector(
    (state) => state.repositorySettings.repositoryCount
  );

  useEffect(() => {
    setTimeout(() => {
      setSaveOutcome("");
    }, 3000);
  }, [saveOutcome, setSaveOutcome]);

  function getRepoObjFromForms() {
    let formsNodeList = document.querySelectorAll(".repoURL, .repoAlias");
    let obj = {};

    const validGithubPattern = new RegExp(
      "^https:\\/\\/github\\.com\\/[-a-zA-Z0-9]+\\/[-a-zA-Z0-9]+$"
    );

    let saveErrorDetected = false;
    let len = formsNodeList.length;
    for (let i = 0; i < len; i += 2)
      if (formsNodeList[i].value)
        if (validGithubPattern.test(formsNodeList[i].value)) {
          obj[formsNodeList[i].value] = {
            alias: formsNodeList[i + 1].value,
            url: formsNodeList[i].value,
          };
        } else {
          saveErrorDetected = true;

          formsNodeList[i].style.border = "2px solid #e42f2f";
          formsNodeList[i].style.backgroundColor = "#c55757";
        }

    return [obj, saveErrorDetected];
  }

  async function submitRepos() {
    let [formsObj, saveErrorDetected] = getRepoObjFromForms();

    getObjectFromChromeStorage(["repositories"]).then(async (repositories) => {
      let newFormsObj = {};

      Object.values(formsObj).forEach((repo, index) => {
        //if it already exists in settings, then the user could have potentially just made a change to the alias
        if (repositories[repo.url]) {
          newFormsObj[repo.url] = {
            ...repositories[repo.url],
            repoAlias: repo.alias,
            index,
          };
        } else {
          //otherwise, a new repository has been added
          newFormsObj[repo.url] = {
            repoURL: repo.url,
            repoAlias: repo.alias,
            index,
          };
        }
      });
      await setValueToChromeStorage("repositories", newFormsObj);

      let repoCount = Object.values(formsObj).length || 0;
      if (repoCount)
        setSaveOutcome(
          `Successfully set ${repoCount} repositor${
            repoCount == 1 ? `y` : `ies`
          }`
        );
      else if (!saveErrorDetected)
        setSaveOutcome("Successfully cleared repositories");
    });
  }

  function displayRepoForms() {
    let repoFormArray = [];
    repoFormArray = repository_array.map((repo, index) => {
      return (
        <RepoForm
          url={repo.repoURL}
          alias={repo.repoAlias}
          key={repo.repoURL + index}
        />
      );
    });
    let savedRepoCount = repository_array.length;
    if (repositoryCount > savedRepoCount) {
      let len = repositoryCount - savedRepoCount;
      for (let i = 0; i < len; i++) {
        repoFormArray.push(<RepoForm url={""} alias={""} key={i} />);
      }
    }
    return repoFormArray;
  }

  return (
    <div className="formContainer">
      <form id="repos">
        {displayRepoForms()}
        <div>
          {repositoryCount != 9 && (
            <a
              className="custom_button"
              onClick={(e) => {
                e.preventDefault();
                dispatch(incrementRepoFormCount());
              }}
            >
              Add
            </a>
          )}
          <a
            className="custom_button"
            onClick={(e) => {
              e.preventDefault();
              submitRepos();
            }}
          >
            Save
          </a>
        </div>
      </form>
      <div className="on-save-outcome">{saveOutcome}</div>
    </div>
  );
};

export default RepoSettings;
