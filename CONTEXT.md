# CONTEXT

Glossary for the single repository context. Terms here describe the domain, never implementation details.

## Release automation

- **release**: a tagged, versioned snapshot of the package, published to GitHub as a Release with notes. Created automatically on push to `main` when the commits since the last release warrant a version change.
- **version bump**: the increment of the declared package version (SemVer: `major.minor.patch`) plus a matching `v<version>` git tag.
- **conventional commit**: a commit message of the form `type(scope): description` (e.g. `feat: add skill`). The commit type is the single source of truth for what a release will contain.
- **changeset** (retired): a human-written file describing a pending version bump and changelog entry. Formerly the trigger for the versioning flow; replaced by conventional commits.
- **semantic-release**: the tool that derives a version from conventional commits, writes the changelog, bumps the declared version, and tags + publishes the release.
- **skill publish**: the act of publishing agent skills to their repository via `gh skill publish`; a separate concern from versioning, run after a release succeeds.

## Version determinants

- **breaking change**: a change that requires users to adapt, flagged by `BREAKING CHANGE` in a commit; forces a major bump.
- **feature**: new capability, flagged by a `feat` commit; forces a minor bump.
- **fix**: bug correction, flagged by a `fix` or `perf` commit; forces a patch bump.
