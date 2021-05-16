# Github Project Board Automation
> Automation events for the Github Project Board

## Getting Started

- [Basic Usage](#basic-usage)
- [Properties](#properties)
- [Contribution](#contribution)
- [Questions](#questions)

### Basic Usage
```.yml
name: Add Pull Requests to Project Board
'on':
  - pull_request
jobs:
  add:
    name: Add to Board
    runs-on: macos-latest
    timeout-minutes: 2
    steps:
      - name: GitHub Project Board Automation
        uses: pritishvaidya/github-project-board-automation@0.0.1.5
        with:
          projects: Iron Maiden,Metallica
          column: In progress
          token: ${{ secrets.GITHUB_TOKEN  }}
```

### Properties
| Input  | Default  | Type | Description |
| :------------ |:---------------| :---------------| :-----|
| on | required | string | [pull_request], [pull_request_target], [pull_request_review], [pull_request_review_comment], [issues], [issue_comment] |
| projects | required | string | Comma separated Values of Project Board |
| column | required | string | Column in the Project Board to take action |
| token | required | string | GitHub access token |
| action | update | string | Action taken on the Project Card |

## Contribution

- [@pritishvaidya](mailto:contact@pritishvaidya.dev) The main author.

## Questions

Feel free to [contact me](mailto:pritishvaidya94@gmail.co) or [create an issue](https://github.com/pritishvaidya/github-project-board-automation/issues/new)

[pull_request]: https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request
[pull_request_target]: https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_target
[pull_request_review]: https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_review
[pull_request_review_comment]: https://docs.github.com/en/actions/reference/events-that-trigger-workflows#pull_request_review_comment
[issues]: https://docs.github.com/en/actions/reference/events-that-trigger-workflows#issues
[issue_comment]: https://docs.github.com/en/actions/reference/events-that-trigger-workflows#issue_comment
