import { WebhookPayload } from "@actions/github/lib/interfaces";
import { Context } from "@actions/github/lib/context";
import { GitHub } from "@actions/github/lib/utils";
import {
  Project,
  ProjectCard,
  ProjectCardConnection,
  ProjectColumn,
  ProjectConnection,
  ProjectOwner,
} from "@octokit/graphql-schema/schema";

type Maybe<T> = T | null;

type ProjectBoardQuery = {
  url: string | undefined;
  event: string;
  projectBoard?: string;
};

type ExtractBoardDataType = {
  context: Context;
};

type GetBoardURLType = {
  payload: WebhookPayload;
  event: string;
};

type GetProjectBoardType = {
  octokit: InstanceType<typeof GitHub>;
  url: string;
  event: string;
  projectBoard: string;
};

type CreateProjectBoardMutationsType = {
  octokit: InstanceType<typeof GitHub>;
  nodeId: string;
  action: string;
  resource: {
    projectCards: ProjectCardConnection;
    repository: {
      projects: ProjectConnection;
      owner: ProjectOwner;
    };
  };
  projectBoard: string;
  column: string;
};

type ProjectCardCheckerType = {
  card: Maybe<ProjectCard> | undefined;
  column: Maybe<ProjectColumn> | undefined;
};

type LastProjectCardType = {
  column: Maybe<ProjectColumn>;
};

export type {
  Maybe,
  Project,
  ProjectCardConnection,
  ProjectBoardQuery,
  ExtractBoardDataType,
  GetBoardURLType,
  GetProjectBoardType,
  CreateProjectBoardMutationsType,
  ProjectCardCheckerType,
  LastProjectCardType,
};
