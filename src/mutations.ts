/* @ts-expect-error: Fake Tag doesn't have types */
import gql from "fake-tag";
import {
  AddProjectCardInput,
  AddProjectColumnInput,
  DeleteProjectCardInput,
  MoveProjectCardInput,
  UpdateProjectCardInput,
} from "@octokit/graphql-schema";

const addProjectColumn = ({
  name,
  projectId,
}: AddProjectColumnInput): string => gql`
    mutation {
        addProjectColumn(input: {name: "${name}", projectId: "${projectId}"}) {
            projectColumn
            clientMutationId
        }
    }
`;

const addProjectCard = ({
  contentId,
  projectColumnId,
}: AddProjectCardInput): string => gql`
    mutation {
        addProjectCard(input: {contentId: "${contentId}", projectColumnId: "${projectColumnId}"}) {
            cardEdge {
                node {
                    id
                }
            }
            clientMutationId
        }
    }
`;

const moveProjectCard = ({
  cardId,
  columnId,
  afterCardId,
}: MoveProjectCardInput): string => gql`
    mutation {
        moveProjectCard(input: {cardId: "${cardId}", columnId: "${columnId}", afterCardId : "${afterCardId}"}) {
            clientMutationId
        }
    }
`;

const deleteProjectCard = ({ cardId }: DeleteProjectCardInput): string => gql`
    mutation {
        deleteProjectCard(input: {cardId: "${cardId}"}) {
            clientMutationId
        }
    }
`;

const updateProjectCard = ({
  projectCardId,
  isArchived,
}: UpdateProjectCardInput): string => gql`
    mutation {
        updateProjectCard(input: {projectCardId: "${projectCardId}", isArchived : "${isArchived}"}) {
            clientMutationId
        }
    }
`;

export {
  addProjectColumn,
  addProjectCard,
  moveProjectCard,
  deleteProjectCard,
  updateProjectCard,
};
