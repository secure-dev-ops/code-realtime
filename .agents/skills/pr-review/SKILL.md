---
name: pr-review
description: Guide for how to review a GitHub Pull Request (PR) and how to report the result of the review.
---

# PR Review
Obtain information about code changes in a PR, review the changes and output a report in markdown format.

**Prerequisites:** GitHub CLI (`gh`) must be installed and authenticated (`gh auth login`).

## Obtain changes from the PR
PRs are located in this GitHub repository: https://github01.hclpnp.com/Modeling/rtistic-pub-doc/pulls
Use the GitHub command-line tool (`gh`) for fetching information about the changes in the PR. If the user is not authenticated tell him to do so before proceeding.

Do not try to get the PR changes using some other means than the `gh` tool.

Do not consider any existing review comments for the PR; always review the code changes as if there were no previous comments.

If the specified PR number is not valid (does not exist) stop and inform the user.

## Review PR changes
There are two types of changes to review: code changes (under the `art-samples` and `art-comp-test` folders) and documentation changes (under the `docs-sources` folder). For code changes, focus on correctness, readability, maintainability, and adherence to coding standards. For documentation changes, focus on clarity, accuracy, and completeness.

Do not comment on code or documentation that is not part of the reviewed changes.

## Report result of review
Write the result of the review to a markdown file and place it in the "pr-reviews" folder.

Name the file `PRXXX_review.md` where XXX is the PR number. If such a file already exists, append a number to the file name, e.g. `PRXXX_review_1.md`, to avoid overwriting existing files.

The review should start with a summary of the PR changes, and then use a numbered list for each review comment. Where possible include a reference to the changed file (name and line number).

At the end of the review, include a note with the text "This review was performed by AI using the pr-review skill of rtistic-pub-doc.".

Finally, open the markdown file in VS Code and ask the user to copy its contents and paste it as a comment in the PR. Print the URL of the PR which is https://github01.hclpnp.com/Modeling/rtistic-pub-doc/pull/XXX where XXX is the PR number, so the user can just click it to open the PR in the web browser.

