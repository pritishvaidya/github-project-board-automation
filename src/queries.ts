/* @ts-expect-error: Fake Tag doesn't have types */
import gql from "fake-tag";
import type { ProjectBoardQuery } from "./types";
import { EVENT_LIST } from "./constants";

const projectBoardFragment = ({ projects }: { projects: Array<string> }) =>
  projects.map(
    (project: any, index: any) => gql`
     project${index}: projects(states: OPEN, search: "${project}", first: 1) {
       nodes {
         id
         name
         columns(first: 10) {
           nodes {
             id
             name
             cards {
               nodes {
                 id
               }
             }
           }
         }   
       }
      }
`
  );

const projectBoardQuery = ({
  url,
  event,
  projects,
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
      author {
        ... on User {
          id
        }
      }
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
        ${projectBoardFragment({ projects })}
         owner {
          ... on ProjectOwner {
            id
            ${projectBoardFragment({ projects })}
          }
        }
       }
      }
    }
  }
  `;
};

export { projectBoardQuery };
