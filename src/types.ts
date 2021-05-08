import { WebhookPayload } from "@actions/github/lib/interfaces";
import { Context } from "@actions/github/lib/context";

type BoardQuery = {
  url: string | undefined;
  event: string;
  board?: string;
};

type ExtractBoardData = {
  context: Context;
};

type GetBoardURLType = {
  payload: WebhookPayload;
  event: string;
};

export type { BoardQuery, ExtractBoardData, GetBoardURLType };
