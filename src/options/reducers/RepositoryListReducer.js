import {
  SET_REPOSITORY_COUNT,
  INCREMENT_REPO_COUNT,
  DELETE_REPO,
  REPOSITORIES_LOADED,
} from "../actions";
import { getObjectFromChromeStorage } from "../../utils";

const initialState = {
  repositories: {},
  repositoryCount: 1,
};

export default function repositoryListReducer(state = initialState, action) {
  switch (action.type) {
    case SET_REPOSITORY_COUNT:
      return {
        ...state,
        repositoryCount: action.payload,
      };
    case INCREMENT_REPO_COUNT:
      return {
        ...state,
        repositoryCount:
          state.repositoryCount == 9 ? 9 : state.repositoryCount + 1,
      };
    case DELETE_REPO: {
      const currentRepos = { ...state.repositories };
      delete currentRepos[action.payload];
      return {
        ...state,
        repositories: { ...currentRepos },
        repositoryCount:
          state.repositoryCount == 1 ? 1 : state.repositoryCount - 1,
      };
    }
    case REPOSITORIES_LOADED:
      return {
        ...state,
        repositories: action.payload,
      };
    default:
      return state;
  }
}

export async function fetchRepoArray(dispatch, getState) {
  const repositories = await getObjectFromChromeStorage("repositories");
  const count = Object.values(repositories).length || 1;
  dispatch({ type: SET_REPOSITORY_COUNT, payload: count });
  dispatch({ type: REPOSITORIES_LOADED, payload: repositories });
}
