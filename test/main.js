import cp from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

import * as tap from 'tap';

const fixturesDir = path.resolve(
  path.dirname(url.fileURLToPath(new URL(import.meta.url))),
  "fixtures",
);

for (const testProject of fs.readdirSync(fixturesDir)) {
  const testProjectPath = path.resolve(fixturesDir, testProject);
  if (!fs.lstatSync(testProjectPath).isDirectory()) {
    continue;
  }

  tap.test(testProject, (t) => {
    const manifestPath = path.resolve(testProjectPath, "package.json");

    const { stdout, status } = cp.spawnSync(
      "node",
      [
        "main.js",
        "--manifest",
        manifestPath,
      ],
      { encoding: "utf-8" },
    );
    t.matchSnapshot(stdout);
    t.matchSnapshot(status);

    t.end();
  });
}
