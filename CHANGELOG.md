# Changelog

All notable changes to _npm-updatedt_ will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [0.1.1] - 2023-05-01

- Added `--omit <dev|prod>` flag (repeatable) with value validation.
- Added `--version` flag.
- Fixed exit codes (`1` for runtime errors and `2` usage errors).
- Improved `--help` text.
- (!) Removed `--dev-only` flag (use `--omit prod` instead).
- (!) Removed `--prod-only` flag (use `--omit dev` instead).

## [0.1.0] - 2023-04-19

- Created a basic CLI to update transitive dependencies of npm projects.
- Default to updating the dependencies of the current working directory project.
- Support updating production and development dependencies.
- Added `--help` flag with usage, flags, and examples.
- Added `--manifest` flag to configure what `package.json` to update.
- Added `--dev-only` flag to only update transitive development dependencies.
- Added `--prod-only` flag to only update transitive production dependencies.
- Added validation that only one of `--dev-only` or `--prod-only` is used.
- Added validation that `--manifest` is provided a value.
- Added validation that the (implied or specified) `package.json` file exists.

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
