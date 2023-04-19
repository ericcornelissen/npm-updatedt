import * as cp from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";

// -----------------------------------------------------------------------------

const INDEX_NOT_FOUND = -1;
const UTF8 = "utf-8";

// -----------------------------------------------------------------------------

const EXIT_CODE_SUCCESS = 0;
const EXIT_CODE_USAGE_ERROR = 1;
const EXIT_CODE_RUNTIME_ERROR = 2;

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
    process.exit(EXIT_CODE_USAGE_ERROR);
  }
}

function updateDependencies(dependencies, npmArgs) {
  for (const [name, version] of Object.entries(dependencies)) {
    updateDependency(name, version, npmArgs);
  }
}

// -----------------------------------------------------------------------------

const FLAG_DEV_ONLY = "--dev-only";
const FLAG_HELP = "--help";
const FLAG_MANIFEST = "--manifest";
const FLAG_PROD_ONLY = "--prod-only";

const devOnly = process.argv.indexOf(FLAG_DEV_ONLY) !== INDEX_NOT_FOUND;
const help = process.argv.indexOf(FLAG_HELP) !== INDEX_NOT_FOUND;
const manifestFlagIndex = process.argv.indexOf(FLAG_MANIFEST);
const prodOnly = process.argv.indexOf(FLAG_PROD_ONLY) !== INDEX_NOT_FOUND;

// -----------------------------------------------------------------------------

if (help) {
console.log(`
Update the transitive dependencies of an npm project.

USAGE:

  npm-updatedt [${FLAG_MANIFEST} PATH] [${FLAG_PROD_ONLY}|${FLAG_DEV_ONLY}]

FLAGS:

   --dev-only          Update transitive dependencies of devDependencies only.
       --help          Show this help message.
   --manifest [PATH]   A path to a 'package.json' file.
  --prod-only          Update transitive dependencies of dependencies only.

EXAMPLE:

  Update transitive dependencies for the project in the current directory.
    npm-updatedt

  Update transitive devDependencies for the project in the current directory.
    npm-updatedt ${FLAG_DEV_ONLY}

  Update transitive dependencies in another directory.
    npm-updatedt ${FLAG_MANIFEST} project/package.json
`);
process.exit(EXIT_CODE_SUCCESS);
}

// -----------------------------------------------------------------------------

if (devOnly && prodOnly) {
  console.error(`Please use either '${FLAG_PROD_ONLY}' or '${FLAG_DEV_ONLY}'.`);
  process.exit(EXIT_CODE_RUNTIME_ERROR);
}

// -----------------------------------------------------------------------------

let manifestPath;
if (manifestFlagIndex === INDEX_NOT_FOUND) {
  manifestPath = path.resolve(".", "package.json");
} else {
  const manifestPathInput = process.argv[manifestFlagIndex + 1];
  if (manifestPathInput === undefined) {
    console.error(`The '${FLAG_MANIFEST}' flag must be provided with a value.`);
    process.exit(EXIT_CODE_RUNTIME_ERROR);
  }

  manifestPath = path.resolve(".", manifestPathInput);
}

if (!fs.existsSync(manifestPath)) {
  console.error("No project manifest found.");
  console.error(`Manifest path was '${manifestPath}'`);
  process.exit(EXIT_CODE_USAGE_ERROR);
}

const projectPath = path.dirname(manifestPath);

// -----------------------------------------------------------------------------

const manifestRaw = fs.readFileSync(manifestPath, { encoding: UTF8 });
const manifest = JSON.parse(manifestRaw);

if (!devOnly) {
  updateDependencies(manifest.dependencies, []);
}

if (!prodOnly) {
  updateDependencies(manifest.devDependencies, ["--save-dev"]);
}

console.log();
console.log("Done.");
process.exit(EXIT_CODE_SUCCESS);
