import type { BoardQuery } from "./types";

const projectCard = `
  fragment projectFields on ProjectCard {
    projectCards {
      nodes {
        id
        isArchived
        project {
          name
          id
        }
      }
    }
  }`;

const boardQuery = ({ url, event }: BoardQuery): string => {
  if (!event) {
    throw new Error(`Unable to fetch event from Github Context`);
  }
  if (!url) {
    throw new Error(
      `Unable to fetch Github Resource URL for the event ${event}`
    );
  }
  return `query {
        resource(url: "${url}") {
        ... on PullRequest {
          ...${projectCard}
        }
        ... on Issue {
          ...${projectCard}
        }
        ... on PullRequestCommit {
          pullRequest {
            ...${projectCard}
        }
      }
    }
  `;
};

export { boardQuery };
