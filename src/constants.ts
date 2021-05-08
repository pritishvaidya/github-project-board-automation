const EVENT_LIST = {
  pullRequest: [
    "pull_request",
    "pull_request_target",
    "pull_request_review",
    "pull_request_review_comment",
  ],
  issues: ["issues", "issue_comment"],
  labels: ["label"],
  getAllEvents() {
    return [...this.pullRequest, ...this.issues, ...this.labels];
  },
};

export { EVENT_LIST };
