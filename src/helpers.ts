import type {
  ProjectCardConnection,
  FormatProjectBoardQueryType,
  ExtractBoardDataType,
  GetBoardURLType,
  // ProjectCardCheckerType,
  LastProjectCardType,
  ResourceType,
} from "./types";
import { EVENT_LIST } from "./constants";
import { Project } from "./types";

function getUrl({ payload, event }: GetBoardURLType) {
  if (EVENT_LIST.pullRequest.includes(event)) {
    return payload.pull_request;
  } else if (EVENT_LIST.issues.includes(event)) {
    return payload.issue;
  } else if (EVENT_LIST.labels.includes(event)) {
    return { ...payload.label, html_url: payload.label.url };
  } else {
    return null;
  }
}

function extractBoardData({ context }: ExtractBoardDataType) {
  const { eventName: event, payload } = context;
  const requiredEvents = EVENT_LIST.getAllEvents();
  if (!requiredEvents.includes(event)) {
    throw new Error(
      `Allowed webhooks - ${requiredEvents.join(", ")}, received - ${event}`
    );
  }

  return {
    event,
    action: payload.action,
    nodeId: getUrl({ payload, event })?.node_id,
    url: getUrl({ payload, event })?.html_url,
  };
}

function formatProjectQuery({
  resource,
  projects,
}: FormatProjectBoardQueryType): ResourceType {
  return {
    ...resource,
    repository: {
      // @ts-expect-error
      projects: {
        nodes: projects
          // @ts-expect-error
          .map((_, index) => resource.repository[`project${index}`]?.nodes[0])
          .filter(Boolean),
      },
      owner: {
        // @ts-expect-error
        projects: {
          nodes: projects
            .map(
              (_, index) =>
                // @ts-ignore
                resource.repository.owner[`project${index}`]?.nodes[0]
            )
            .filter(Boolean),
        },
      },
    },
  };
}

function uniqify(array: Array<Project>, key: string): Array<Project> {
  /* @ts-expect-error */
  return array.reduce(
    (prev, curr) =>
      /* @ts-expect-error */
      prev.find((a) => a[key] === curr[key]) ? prev : prev.push(curr) && prev,
    []
  );
}

function getUniqueProjects(
  projectNodes: Array<Project>,
  ownerProjectNodes: Array<Project>
): Array<Project> {
  return uniqify([...(projectNodes || []), ...ownerProjectNodes], "id");
}

function lastCardElement({ column }: LastProjectCardType) {
  return column?.cards?.nodes?.slice(-1)[0];
}

/* function isLastElement({ card, column }: ProjectCardCheckerType) {
  const lastCard = column?.cards?.nodes?.slice(-1)[0];
  return lastCard && lastCard?.id === card?.id;
} */

function validateUniqueProjects(
  projects: Array<Project>,
  column: string,
  projectCards: ProjectCardConnection
) {
  return projects.flatMap((project) => {
    const columnItem = project.columns?.nodes?.find(
      // @ts-expect-error: Types not defined correctly
      ({ name }) => name === column
    );
    const card = projectCards?.nodes?.find(
      (cardItem) => project.id === cardItem?.project.id
    );
    if (columnItem) {
      const { id, name } = project;
      const lastCard = lastCardElement({ column: columnItem });
      return {
        id,
        name,
        column: columnItem,
        previousCard: lastCard || { id: null },
        card: card ? { id: card.id, isArchived: card.isArchived } : {},
      };
    }
    return [];
  });
}

export {
  extractBoardData,
  formatProjectQuery,
  getUniqueProjects,
  validateUniqueProjects,
};
