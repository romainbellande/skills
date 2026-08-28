# Skills

Here is my personal skills repository.

## Installation

With [`npx skills`](https://github.com/vercel-labs/skills):

```sh
# all skills
npx skills add romainbellande/skills -g -a universal

# a single skill
npx skills add romainbellande/skills -g -a universal --skill lefthook
```

Available skills: `agent-browser`, `editorial-diagram`, `document-existing-project`,
`create-github-pull-request`, `create-github-pull-request-template`,
`setup-semantic-release`, `lefthook`.

## Requirements

Some skills relies on other skills to work.

| Skill needed | Needed for | Installation instruction |
| --- | --- | --- |
| drawio-skill | [skills/diagrams/editorial-diagram](skills/diagrams/editorial-diagram) | `npx skills add Agents365-ai/365-skills -g -a universal --skill drawio-skill` |
