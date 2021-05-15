/* @ts-expect-error: Fake Tag doesn't have types */
import gql from "fake-tag";
import type { ProjectBoardQuery } from "./types";
import { EVENT_LIST } from "./constants";

const projectBoardQuery = ({
  url,
  event,
  projectBoard,
}: ProjectBoardQuery): string => {
  if (!event) {
    throw new Error("Unable to fetch event from Github Context");
  }
  if (!url) {
    throw new Error(
      `Unable to fetch Github Resource URL for the event ${event}`
    );
  }
  return gql`query {
    resource(url: "${url}") {
    ... on ${EVENT_LIST.issues.includes(event) ? "Issue" : "PullRequest"} {
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
      repository {
        projects(first: 10, search: "${projectBoard}", states: OPEN) {
          nodes {
             id
             name
             columns(first: 10) {
               nodes {
                 id
                 name
               }
             }
           }
         }
         owner {
          ... on ProjectOwner {
            id
            projects(states: OPEN, search: "${projectBoard}", first: 10) {
              nodes {
                id
                name
                columns(first: 10) {
                  nodes {
                    id
                    name
                  }
                }                
              }
            }
          }
        }
       }
      }
    }
  }
  `;
};

export { projectBoardQuery };
