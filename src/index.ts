import { getInput, setFailed, debug, info } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import getProjectBoardData from "./getProjectBoardData";
import createProjectBoardMutations from "./createProjectBoardMutations";
import { extractBoardData } from "./helpers";

export default (async () => {
  try {
    info("Fetching Input");
    const token = getInput("token");
    const projectsInput = getInput("projects");
    const column = getInput("column");
    const action = getInput("action");

    const projects = projectsInput.split(",");
    debug(
      `Token: "***************************************", Projects: [${projects}], Column: ${column}, Action: ${action}`
    );
    const octokit = getOctokit(token);
    const { url, nodeId, event } = extractBoardData({ context });

    info("Fetching Project Board Data");
    const resource = await getProjectBoardData({
      url,
      event,
      octokit,
      projects,
    });

    info("Creating Graphql Mutations");
    await createProjectBoardMutations({
      octokit,
      nodeId,
      action,
      resource,
      projects,
      column,
    });
    info(
      `Finished Graphql Mutations, action ${action} in the column ${column} and projects [${projects}] has been successful`
    );
  } catch (error) {
    setFailed(error.message);
  }
})();
