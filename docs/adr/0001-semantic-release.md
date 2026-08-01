# 1. Replace changesets with semantic-release

- Status: accepted (amended)
- Date: 2026-08-01

## Context

The repo (single private package `naimor-skills`, published as agent skills via `gh skill publish`, not npm) used changesets: a contributor writes a `changeset` markdown file, CI opens a "Version" pull request, merging it versions and tags the package. No git tags existed despite `package.json` declaring `1.0.1`.

## Decision

Adopt semantic-release for versioning, driven by a single manual release workflow:

- Commit messages (Conventional Commits, enforced by a commitlint CI check on PRs) determine the next version: `feat` → minor, `fix`/`perf` → patch, `BREAKING CHANGE` → major. `chore`/`docs`/etc. produce no release.
- The merged `publish-skills.yml` workflow is triggered manually via `workflow_dispatch` — there is no automatic release on push to `main`.
- On each run, semantic-release bumps `package.json` + `package-lock.json` (via `@semantic-release/npm` with `npmPublish: false` — the package is private, so no npm publish and no `NPM_TOKEN`), commits that bump back to `main` (`@semantic-release/git`, message ends `[skip ci]`), and creates a `v<version>` git tag. It generates release notes but does **not** create a GitHub Release (`@semantic-release/github` removed via `.releaserc`).
- `gh skill publish` runs in the same workflow as a `--dry-run` validation gate only. It never creates a tag or a GitHub Release — the release is created by `gh release create` at the tag semantic-release pushed, because `gh skill publish` refuses to publish onto an existing tag (which semantic-release always creates first). The release is the distribution mechanism `gh skill install` consumes.
- Release notes for `gh release create` come from semantic-release itself: the workflow runs `.github/scripts/generate-release-notes.mjs` (a thin wrapper calling semantic-release's `run` in dry-run mode) before the real run, and feeds the captured `nextRelease.notes` to the release via `--notes-file`.
- If semantic-release cuts no new version (no releasable commits since the last tag), the publish step is skipped.
- One-time switchover: tag current HEAD `v1.0.1` so the first release continues from the declared version.
- The release job authenticates with a GitHub App token (`actions/create-github-app-token`) because the default `GITHUB_TOKEN` cannot bypass the `main` branch-protection rule that the bump commit + tag push must land on. The app is installed on this repo with `contents: write` and allowed through the protection rule; since the trigger is manual there is no push-driven re-trigger loop.

Why this over changesets: no changeset files to write, no version PRs to shepherd; releases are deterministic from history and publishing stays a deliberate human action. Cost: release cadence depends entirely on commit-message discipline and on a human pressing the manual trigger.

## Consequences

- Contributors must write Conventional Commit messages; non-conventional commits are ignored by the release (no error) but now flagged by the commitlint CI check.
- Releases and skill publishing both happen only when a human dispatches the workflow — there is no automatic release on merge.
- `gh skill publish` validates skills first (`--dry-run`); a broken skill blocks the version bump rather than producing a broken release.
- The workflow runs only when triggered manually from the Actions UI; the CI runner `gh` must be recent enough to expose the `skill` preview command.
