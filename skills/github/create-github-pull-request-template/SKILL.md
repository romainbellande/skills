---
name: create-github-pull-request-template
description: Create a GitHub pull request template in the current project. Use when the user asks to add, set up, or install a pull request template, or when another skill needs a PR template before opening a pull request.
license: MIT
---

# Create GitHub Pull Request Template

Plant a pull request template in the project so every PR opens with the same sections and a conventional title.

## 1. Check for an existing template

Look for a template in the standard locations, in order:

- `.github/PULL_REQUEST_TEMPLATE.md`
- `.github/PULL_REQUEST_TEMPLATE/*.md`
- `docs/PULL_REQUEST_TEMPLATE.md`
- `PULL_REQUEST_TEMPLATE.md`

If one exists, stop and show it to the user; create nothing. Replace an existing file only when the user explicitly asks to replace it.

Completion criterion: you know whether a template already exists and which file you will create.

## 2. Write the template

Create `.github/PULL_REQUEST_TEMPLATE.md`, GitHub's default template location.

Write a template whose sections make review routine. Cover:

1. A title line that demands a conventional subject (`<type>(<scope>): <summary>`), since the merged squash commit takes the PR title.
2. What changed, and why.
3. Related issue references (`Closes #…`, `Fixes #…`, `Refs #…`).
4. How to verify the change.
5. Screenshots or visual evidence where the change is visual.
6. An author checklist confirming tests, docs, and conventional commits.

Example:

```markdown
## Title

`<type>(<scope>): <summary>` — keep it a conventional commit subject.

## Summary

What changed, and why.

## Related issue

Closes #123.

## How to verify

1. Run the relevant tests.
2. Check the affected flow manually.

## Screenshots

Before/after, when the change is visual.

## Checklist

- [ ] Tests added or updated
- [ ] Docs updated
- [ ] Commit messages are conventional
```

Completion criterion: the template renders these sections in order, and a reviewer can see what changed, why, how to verify it, and what the author confirmed.
