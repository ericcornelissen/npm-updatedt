// SPDX-License-Identifier: Artistic-2.0

import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";

import meow from "meow";

// -----------------------------------------------------------------------------

const UTF8 = "utf-8";

// -----------------------------------------------------------------------------

const EXIT_CODE_SUCCESS = 0;
const EXIT_CODE_RUNTIME_ERROR = 1;
const EXIT_CODE_USAGE_ERROR = 2;

// -----------------------------------------------------------------------------

function updateDependency(name, version, npmArgs) {
  console.log(`Updating transitive dependencies of '${name}'...`);

  const uninstallResult = cp.spawnSync(
    "npm",
    ["uninstall", ...npmArgs, name],
    { cwd: projectPath, windowsHide: true },
  );

  let installResult = {};
  if (uninstallResult.status === 0) {
    installResult = cp.spawnSync(
      "npm",
      ["install", ...npmArgs, `${name}@${version}`],
      { cwd: projectPath, windowsHide: true },
    );
  }

  if (uninstallResult.status !== 0 || installResult.status !== 0) {
    console.log(`Failed to update transitive dependencies of '${name}'.`);
    console.log("Note: this may mean the dependency is currently missing from");
    console.log("      your project. Please check this and act accordingly.");
    process.exit(EXIT_CODE_RUNTIME_ERROR);
  }
}

function updateDependencies(dependencies, npmArgs) {
  for (const [name, version] of Object.entries(dependencies)) {
    updateDependency(name, version, npmArgs);
  }
}

// -----------------------------------------------------------------------------

const FLAG_HELP = "help";
const FLAG_MANIFEST = "manifest";
const FLAG_OMIT = "omit";
const FLAG_VERSION = "version";

const OMIT_OPT_DEV = "dev";
const OMIT_OPT_PROD = "prod";

const cli = meow(`
USAGE
  $ npm-updatedt [--${FLAG_HELP}] [--${FLAG_VERSION}] [--${FLAG_MANIFEST} PATH]
    [--${FLAG_OMIT} <${OMIT_OPT_DEV}|${OMIT_OPT_PROD}> [--${FLAG_OMIT} <${OMIT_OPT_DEV}|${OMIT_OPT_PROD}> ...]]

OPTIONS
      --${FLAG_HELP}  Show this help message
  --${FLAG_MANIFEST}  A path to a 'package.json' file (default './package.json').
      --${FLAG_OMIT}  Omit the specified type of dependencies (repeatable).
   --${FLAG_VERSION}  Show the CLI version number.

EXAMPLES
  Update all transitive dependencies for the project in the current directory.
    $ npm-updatedt

  Update transitive non-devDependencies for the project in the current directory.
    $ npm-updatedt --${FLAG_OMIT} ${OMIT_OPT_DEV}

  Update transitive dependencies in another directory.
    $ npm-updatedt --${FLAG_MANIFEST} project/package.json
`, {
  allowUnknownFlags: false,
  autoHelp: true,
  autoVersion: true,
  description: "Update the transitive dependencies of an npm project.",
  flags: {
    [FLAG_OMIT]: {
      type: "string",
      alias: null,
      default: null,
      isMultiple: true,
      isRequired: false,
    },
    [FLAG_MANIFEST]: {
      type: "string",
      alias: null,
      default: "./package.json",
      isMultiple: false,
      isRequired: false,
    },
  },
  importMeta: import.meta,
  inferType: false,
});

// -----------------------------------------------------------------------------

const manifestPath = path.resolve(cli.flags.manifest);
const projectPath = path.dirname(manifestPath);

// -----------------------------------------------------------------------------

if (!fs.existsSync(manifestPath)) {
  console.error("No project manifest found.");
  console.error(`Manifest path was '${manifestPath}'`);
  process.exit(EXIT_CODE_USAGE_ERROR);
}

if (!cli.flags.omit.every((omit) => omit === OMIT_OPT_DEV || omit === OMIT_OPT_PROD)) {
  console.error(`Invalid --${FLAG_OMIT} value.`);
  console.error(`Must be one of: '${OMIT_OPT_DEV}', '${OMIT_OPT_PROD}'`);
  process.exit(EXIT_CODE_USAGE_ERROR);
}

// -----------------------------------------------------------------------------

const manifestRaw = fs.readFileSync(manifestPath, { encoding: UTF8 });
const manifest = JSON.parse(manifestRaw);

if (
  !cli.flags.omit.includes(OMIT_OPT_PROD) &&
  manifest.dependencies !== undefined
) {
  updateDependencies(manifest.dependencies, []);
}

if (
  !cli.flags.omit.includes(OMIT_OPT_DEV) &&
  manifest.devDependencies !== undefined
) {
  updateDependencies(manifest.devDependencies, ["--save-dev"]);
}

console.log(/* newline */);
console.log("Done.");
process.exit(EXIT_CODE_SUCCESS);
