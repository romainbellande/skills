---
name: lefthook
description: Set up lefthook git hooks in a project — commitlint on commit messages, gitleaks secret scanning, and lint/format hooks matched to the project's stack. Use when the user wants to add git hooks, install or configure lefthook, enforce commit message conventions, or wire up commitlint, gitleaks, or pre-commit linting and formatting.
license: MIT
---

# Set Up Lefthook Git Hooks

Wire the git hooks that make a repo's guardrails automatic: commitlint on every commit message, gitleaks before every commit, and the project's lint and format tools on staged files. Everything installable from the session installs itself; the user decides only which lint and format tools to adopt.

## 1. Confirm the prerequisites

Confirm a git repo, then detect the runtime and any existing hook tooling:

- Git repo: `git rev-parse --is-inside-work-tree`.
- Runtime from lockfiles: Node (`package.json`), Python (`pyproject.toml` / `uv.lock` / `poetry.lock` / `requirements.txt`), Go (`go.mod`), Ruby (`Gemfile`), Rust (`Cargo.toml`).
- Existing tooling: any `lefthook.yml` / `.lefthook.yml`, and any lint or format config (`eslint.config.*`, `.prettierrc*`, `ruff.toml`, `.golangci.yaml`, ...). Reuse what already exists — never install a second config for a tool that's already configured.

If a lefthook config already exists, report it and ask whether to extend it or stop.

Completion criterion: you can state the runtime, the package manager, and whether lefthook or any lint/format tool is already configured.

## 2. Choose the lint and format tools

Suggest the default lint and format tools for the detected stack from `references/lint-format.md`, present each to the user with a one-line reason, and let them accept, swap, or decline. Never silently pick; never install a tool whose config already exists. Either tool may be declined — gitleaks and commitlint run regardless.

Completion criterion: the user has confirmed or declined a lint tool and a format tool, and you can name the exact command each will run.

## 3. Install lefthook and the hook tools

Install automatically wherever the session can. Per package manager:

- Node: `npm i -D lefthook @commitlint/cli @commitlint/config-conventional` plus the chosen dev tools.
- Python: `uv add --dev lefthook` (or `pip install lefthook`); gitleaks from `brew install gitleaks` or the binary on the gitleaks releases page.
- macOS: `brew install lefthook gitleaks` covers both.
- Any other stack: commitlint is Node-only — install it with npm (`npm i -D @commitlint/cli @commitlint/config-conventional`); install lefthook and gitleaks from their binary releases when no package manager fits.

When an install can't run from the session, give the user the exact command and wait for them to run it. All three tools must answer to their version command before you continue.

Completion criterion: `lefthook --version`, `gitleaks version`, and `npx commitlint --version` each exit 0, and the chosen lint/format tools are installed or the user declined them.

## 4. Configure commitlint

Write `commitlint.config.mjs` (`commitlint.config.js` with `module.exports` if the project is CommonJS):

```js
export default { extends: ['@commitlint/config-conventional'] };
```

Completion criterion: `npx commitlint --print-config` exits 0.

## 5. Write the lefthook config

Write `lefthook.yml` from `references/lefthook.yml`, substituting the commands chosen in step 2 for the `lint` and `format` placeholders — and dropping either block the user declined. The config is the single source of truth for the hooks; if another `lefthook.yml` or git-hook tool's config exists, reconcile it in this file.

Completion criterion: `lefthook validate` exits 0.

## 6. Install the hooks and verify

1. `lefthook install` — writes the git hooks. In a Node project lefthook also auto-installs on every `npm install`, so new clones inherit the guardrails.
2. Verify: `lefthook check-install` reports the hooks installed and current, then commit the config files written in steps 4–5 with a conventional message (e.g. `chore: add lefthook hooks`) and watch the hooks run green — a real commit is the only check that exercises `commit-msg`.
3. If a hook fails, fix the underlying issue (wrong command, missing tool, a secret gitleaks flags) and re-run. Never advise bypassing a hook.

Completion criterion: `lefthook check-install` is green and the first commit through the hooks succeeded with the expected hooks firing.
