---
name: create-github-pull-request
description: Open a pull request in the current project, filling the project's PR template and deriving the title with the conventional commit skill. Use when the user wants to open a pull request, or when another skill needs one opened.
license: MIT
---

# Create GitHub Pull Request

Open a pull request whose title and body follow the project's template and the conventional commit format.

## 1. Gather the PR's raw material

1. Read the current branch and the base branch (`git branch --show-current`; the default branch from `git remote show origin` or `gh repo view`).
2. Read the branch's commits and diff against base (`git log --oneline <base>..HEAD`, `git diff <base>...HEAD`).
3. Confirm the branch is committed and pushed to the remote.

Completion criterion: you can state the base branch, the head branch, and the branch's user-facing change in one sentence.

## 2. Ensure a template exists

Check the standard template locations (`.github/PULL_REQUEST_TEMPLATE.md`, `.github/PULL_REQUEST_TEMPLATE/*.md`, `docs/PULL_REQUEST_TEMPLATE.md`, `PULL_REQUEST_TEMPLATE.md`). If no pull request template exists, invoke the `create-github-pull-request-template` skill, then read the template it created.

Completion criterion: a template file is present and you have read its sections.

## 3. Derive the title

Run the `conventional-commit-message` skill on the branch's commits and turn the change into one conventional subject for the PR title — the same type and scope rules apply, because the merged squash commit takes the title.

Completion criterion: the title is a valid conventional subject naming the branch's user-facing change.

## 4. Fill the template

Map the gathered material into the template's sections: the summary from the diff, related issues from commit footers, verification steps from the tests or changed flow. Fill every section from evidence; leave none as a placeholder.

Completion criterion: every template section is filled from the gathered material.

## 5. Open and verify

1. Write the filled template to a file and open the PR:

   `gh pr create --title "<title>" --body-file <file>`

2. Confirm the PR opened on the intended branches: `gh pr view --json state,baseRefName,headRefName,url`.

3. Watch the status checks until they finish: `gh pr checks --watch`. Report each check's state and any failures; rerun failed checks only when the user asks.

If `gh` is unavailable, report that and stop.

Completion criterion: the PR is `OPEN` on the intended branches, its status checks are reported, and you share its URL.
