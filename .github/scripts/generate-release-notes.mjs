import { writeFileSync } from "node:fs";
import run from "semantic-release";

const result = await run(
  { dryRun: true, noCi: true },
  { cwd: process.cwd(), env: process.env },
);

if (result && result.nextRelease) {
  writeFileSync("release-notes.md", result.nextRelease.notes);
}
