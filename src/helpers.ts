import type {
  ProjectCardConnection,
  ExtractBoardDataType,
  GetBoardURLType,
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
    nodeId: getUrl({ payload, event })?.nodeId,
    url: getUrl({ payload, event })?.html_url,
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
      return {
        id,
        name,
        column: columnItem,
        card: card ? { id: card.id, isArchived: card.isArchived } : {},
      };
    }
    return [];
  });
}

export { extractBoardData, getUniqueProjects, validateUniqueProjects };
