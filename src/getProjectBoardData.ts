import { projectBoardQuery } from "./queries";
import { GetProjectBoardType } from "./types";
import { formatProjectQuery } from "./helpers";

async function getProjectBoardData({
  octokit,
  url,
  event,
  projects,
}: GetProjectBoardType) {
  const createProjectBoardQuery = projectBoardQuery({
    url,
    event,
    projects,
  });
  const { resource } = await octokit.graphql(createProjectBoardQuery);

  if (!resource) {
    throw new Error(
      "You do not have sufficient permissions to access this repository"
    );
  }

  return formatProjectQuery({ resource, projects });
}

export default getProjectBoardData;
