import { debug } from "@actions/core";
import {
  CreateProjectBoardMutationsType,
  AddAssigneesToAssignableInput,
} from "./types";
import { getUniqueProjects, validateUniqueProjects } from "./helpers";
import {
  addAssignees,
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
  projects,
  column,
}: CreateProjectBoardMutationsType) {
  if (!resource) {
    throw new Error("Unable to fetch URL from Github Context");
  }

  const {
    author,
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
  const validatedProjects = validateUniqueProjects(
    uniqueProjects,
    column,
    projectCards
  );

  if (!validatedProjects.length) {
    throw new Error(`Unable to find Project [${projects}] or Column ${column}`);
  }

  const mutations = [];

  console.log({ author });

  debug(`Author: { id: ${author.id} }`);
  debug(
    `Projects: ${JSON.stringify(
      validatedProjects
        .map(
          ({ id, name, column }) =>
            `{ id: ${id}, name: ${name}, columnId: ${column.id}, columnName: ${column.name} }`
        )
        .join(" , ")
    )}`
  );

  mutations.push(
    addAssignees(<AddAssigneesToAssignableInput>{
      assignableId: contentId,
      assigneeIds: [author.id],
    })
  );
  for (const { card, previousCard, column } of validatedProjects) {
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
