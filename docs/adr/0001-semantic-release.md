# 1. Replace changesets with semantic-release

- Status: accepted
- Date: 2026-08-01

## Context

The repo (single private package `naimor-skills`, published as agent skills via `gh skill publish`, not npm) used changesets: a contributor writes a `changeset` markdown file, CI opens a "Version" pull request, merging it versions and tags the package. No git tags existed despite `package.json` declaring `1.0.1`.

## Decision

Adopt semantic-release for versioning and releasing on push to `main`:

- Commit messages (Conventional Commits, enforced by a commitlint CI check on PRs) determine the next version: `feat` → minor, `fix`/`perf` → patch, `BREAKING CHANGE` → major. `chore`/`docs`/etc. produce no release.
- On each push to `main`, semantic-release writes `CHANGELOG.md`, bumps `package.json` + `package-lock.json` (via `@semantic-release/npm` with `npmPublish: false` — the package is private, so no npm publish and no `NPM_TOKEN`), commits that bump back to `main` (`@semantic-release/git`, message ends `[skip ci]`), and creates a `v<version>` git tag + GitHub Release.
- `gh skill publish` is not part of the release pipeline; it runs from a manual `workflow_dispatch` workflow (`publish-skills.yml`) so publishing the skills stays a deliberate human action.
- One-time switchover: tag current HEAD `v1.0.1` so the first release continues from the declared version.
- The `github-actions` bot is allowed to bypass the `main` branch-protection rule so the bump commit + tag push can land.

Why this over changesets: no changeset files to write, no version PRs to shepherd; releases happen automatically and deterministically from history. Cost: release cadence depends entirely on commit-message discipline.

## Consequences

- Contributors must write Conventional Commit messages; non-conventional commits are ignored by the release (no error) but now flagged by the commitlint CI check.
- Releases are fully automatic on merge to `main` — there is no human gate before a version is cut.
- The `github-actions` bot needs bypass rights on `main`; with `GITHUB_TOKEN` (not a PAT) its push does not re-trigger the workflow, so there is no release loop.
- `gh skill publish` runs only when triggered manually from the Actions UI; the CI runner `gh` must be recent enough to expose the `skill` preview command.
