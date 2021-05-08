import { getInput, setFailed } from "@actions/core";
import { getOctokit, context } from "@actions/github";
import { extractBoardData } from "./helpers";
import { boardQuery } from "./queries";

export default (async () => {
  try {
    const token = getInput("token");
    const board = getInput("project-board");
    const column = getInput("column");
    const action = getInput("action");

    // Get Project Board Data
    const { url, event } = extractBoardData({ context });

    // Generate Token
    const octokit = getOctokit(token);

    // Get Resource from Query
    const createProjectBoardQuery = boardQuery({ url, event });
    const { resource } = await octokit.graphql(createProjectBoardQuery);

    console.log(resource);
  } catch (error) {
    setFailed(error.message);
  }
})();
