import type { ExtractBoardData, GetBoardURLType } from "./types";
import { EVENT_LIST } from "./constants";

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

function extractBoardData({ context }: ExtractBoardData) {
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

export { extractBoardData };
