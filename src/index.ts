import { getInput, setFailed, debug, info } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import getProjectBoardData from "./getProjectBoardData";
import createProjectBoardMutations from "./createProjectBoardMutations";
import { extractBoardData } from "./helpers";

export default (async () => {
  try {
    info("Fetching Input");
    const token = getInput("token");
    const projectBoard = getInput("project");
    const column = getInput("column");
    const action = getInput("action");

    debug(
      `Token: "***************************************", Board: ${projectBoard}, Column: ${column}, Action: ${action}`
    );
    const octokit = getOctokit(token);
    const { url, nodeId, event } = extractBoardData({ context });

    info("Fetching Project Board Data");
    const resource = await getProjectBoardData({
      url,
      event,
      octokit,
      projectBoard,
    });

    info("Creating Graphql Mutations");
    await createProjectBoardMutations({
      octokit,
      nodeId,
      action,
      resource,
      projectBoard,
      column,
    });
    info(
      `Finished Graphql Mutations, created Project Card in project ${projectBoard}`
    );
  } catch (error) {
    setFailed(error.message);
  }
})();
