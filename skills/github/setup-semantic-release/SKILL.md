---
name: setup-semantic-release
description: Set up semantic versioning from Conventional Commits — a manually-dispatched GitHub Actions workflow derives the next version, bumps package.json, tags, and creates the GitHub Release.
disable-model-invocation: true
license: MIT
---

# Set Up Semantic Release

Install the deterministic release pipeline: commit messages drive the next version, a human pulls the trigger. No automatic release on push — publishing stays a deliberate act.

## 1. Confirm the requirements

Ask the user to confirm each prerequisite before writing anything.

- A git repo with a `main` branch and a Node project (`package.json`).
- `gh` installed and authenticated; the user can push to `main`.
- Is `main` branch-protected? Ask the user.
  - **Protected**: the user has created a GitHub App, installed it on the repo with `Contents: read & write`, added it under "Allow specified actors to bypass required rules" on `main`, and set the repo variable `RELEASE_APP_ID` and the repo secret `RELEASE_APP_PRIVATE_KEY`. The default `GITHUB_TOKEN` cannot bypass the protection — only the app can land the bump commit and the tag.
  - **Not protected**: no app needed; the workflow authenticates as `GITHUB_TOKEN`.

None of the GitHub-side setup (app creation, installation, branch-protection rules, repo variable and secret) can be done from this session — the user must confirm each item is done in the GitHub UI.

Completion criterion: the user has confirmed every item that applies, and you can state whether the release workflow will authenticate as the app or as `GITHUB_TOKEN`.

## 2. Install the tools

Run `npm i -D semantic-release @semantic-release/git conventional-changelog-conventionalcommits @commitlint/cli @commitlint/config-conventional`.

No `NPM_TOKEN` and no npm publish: the package stays private, so `@semantic-release/npm` runs with `npmPublish: false`.

Completion criterion: `npm ls semantic-release @semantic-release/git` exits 0.

## 3. Write the release config

Write `.releaserc.mjs` from `references/releaserc.mjs`. It is the single source of truth for versioning — if any other `.releaserc*` or changeset config exists, delete it; two configs is how a pipeline goes stale.

It defines the `conventionalcommits` preset (`feat` → minor, `fix`/`perf` → patch, `BREAKING CHANGE` → major, everything else → no release), a bump commit back to `main` ending `[skip ci]`, a `v<version>` tag, and the GitHub Release.

Completion criterion: `npx semantic-release --dry-run` reports the next version with no error.

## 4. Enforce Conventional Commits on PRs

Write `commitlint.config.mjs` and `.github/workflows/commitlint.yml` from `references/`. The commit lint is what makes the versioning in step 3 deterministic — without it, release cadence depends on memory.

Completion criterion: the workflow file exists and the config loads (`npx commitlint --print-config` exits 0).

## 5. Write the release workflow

Write `.github/workflows/release.yml` from the reference matching the branch you confirmed in step 1:

- protected `main` → `references/release-app.yml` (creates a GitHub App token and uses it for checkout and release)
- unprotected `main` → `references/release-simple.yml` (`GITHUB_TOKEN`)

The workflow is manual only (`workflow_dispatch`), so the bump commit and tag can never re-trigger it.

Completion criterion: the file is present, valid YAML, and dispatchable from the Actions tab.

## 6. Align the starting version

If `package.json` already declares a version with no matching `v<version>` tag, tag `HEAD` at the declared version so the first release continues from it: `git tag v$(node -p "require('./package.json').version")`.

Completion criterion: `git describe --tags --abbrev=0` matches the declared version.

## 7. Commit, push, and trigger

1. Commit the configs and workflows, push to `main`.
2. Ask the user to dispatch **Release** from the Actions tab.
3. Confirm the run went green and the release exists: `gh release view` shows the derived version, and `git tag` includes the `v<version>` tag.

Completion criterion: the user has run the workflow once and it went green — a release at the derived version, the bump commit on `main`, the `v<version>` tag.
