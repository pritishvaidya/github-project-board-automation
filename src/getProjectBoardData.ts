import { projectBoardQuery } from "./queries";
import { GetProjectBoardType } from "./types";

async function getProjectBoardData({
  octokit,
  url,
  event,
  projectBoard,
}: GetProjectBoardType) {
  const createProjectBoardQuery = projectBoardQuery({
    url,
    event,
    projectBoard,
  });
  const { resource } = await octokit.graphql(createProjectBoardQuery);
  return resource;
}

export default getProjectBoardData;
