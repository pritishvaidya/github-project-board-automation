import { debug } from "@actions/core";
import { CreateProjectBoardMutationsType } from "./types";
import { getUniqueProjects, validateUniqueProjects } from "./helpers";
import {
  addProjectCard,
  deleteProjectCard,
  moveProjectCard,
  updateProjectCard,
} from "./mutations";
import { ACTION_LIST } from "./constants";

async function createProjectBoardMutations({
  nodeId: contentId,
  octokit,
  action,
  resource,
  projectBoard,
  column,
}: CreateProjectBoardMutationsType) {
  if (!resource) {
    throw new Error("Unable to fetch URL from Github Context");
  }

  const {
    projectCards,
    repository: {
      projects: { nodes: projectNodes },
      owner: {
        projects: { nodes: ownerProjectNodes },
      },
    },
  } = resource;

  debug("Finding Projects with Matching Columns...");
  /* @ts-expect-error: Typings not defined correctly */
  const uniqueProjects = getUniqueProjects(projectNodes, ownerProjectNodes);
  const projects = validateUniqueProjects(uniqueProjects, column, projectCards);

  if (!projects.length) {
    throw new Error(
      `Unable to find Project ${projectBoard} or Column ${column}`
    );
  }

  const mutations = [];

  debug(
    `Projects: ${JSON.stringify(
      projects
        .map(
          ({ id, name, column }) =>
            `{ id: ${id}, name: ${name}, columnId: ${column.id}, columnName: ${column.name} }`
        )
        .join(" , ")
    )}`
  );

  for (const { card, previousCard, column } of projects) {
    if (action === ACTION_LIST.DELETE && card.id) {
      mutations.push(deleteProjectCard({ cardId: card.id }));
    } else if (action === ACTION_LIST.ARCHIVE && card.id && !card.isArchived) {
      mutations.push(
        updateProjectCard({ projectCardId: card.id, isArchived: true })
      );
    } else {
      if (!card.id) {
        const {
          addProjectCard: {
            cardEdge: {
              node: { id },
            },
          },
        } = await octokit.graphql(
          addProjectCard({ contentId, projectColumnId: column.id })
        );
        card.id = id;
      }
      mutations.push(
        moveProjectCard({
          // @ts-ignore
          cardId: card.id,
          columnId: column.id,
          afterCardId: previousCard.id,
        })
      );
    }
  }

  debug(`Running mutations: ${mutations.join("\n")}`);
  return Promise.all(mutations.map((mutation) => octokit.graphql(mutation)));
}

export default createProjectBoardMutations;
