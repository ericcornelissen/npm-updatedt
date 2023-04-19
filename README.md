# npm-updatedt

An experimental tool for updating transitive npm dependencies.

## Idea

The idea behind this tool is to make it easy to update your project's transitive
dependencies.

For example, take this dependency tree:

```sh
$ npm ls --depth 2 --omit dev
example@ /path/to/example/project
└─┬ eslint-plugin-markdown@3.0.0
  ├── eslint@8.38.0 deduped
  └─┬ mdast-util-from-markdown@0.8.5
    ├── @types/mdast@3.0.10
    ├── mdast-util-to-string@2.0.0
    ├── micromark@2.11.4
    ├── parse-entities@2.0.0
    └── unist-util-stringify-position@2.0.3
```

Running this tool might result in the following dependency tree:

```diff
  └─┬ eslint-plugin-markdown@3.0.0
    ├── eslint@8.38.0 deduped
    └─┬ mdast-util-from-markdown@0.8.5
-     ├── @types/mdast@3.0.10
+     ├── @types/mdast@3.0.11
      ├── mdast-util-to-string@2.0.0
      ├── micromark@2.11.4
      ├── parse-entities@2.0.0
      └── unist-util-stringify-position@2.0.3
```

Updating transitive dependencies if a newer version is available that is within
its parent dependency's specified version range.

## Usage

The easiest way to get started is by pulling down this repository and running
the following command from the project root:

```sh
node main.js --help
```

The output of this command should guide you in how use the tool.

## Disclaimer

This software is provided as is (see [LICENSE] for more details). It may leave
your npm project in an incorrect or unwanted state. Use of version control is
advised, only running this tool on a non-dirty project state so that changes can
easily be reverted.

This project is currently in an alpha-like state of development. Correctness is
not guaranteed and any new version may introduce breaking changes.

## License

Like the [npm cli], this project is licensed under the Artistic License 2.0
license, see [LICENSE] for the full license text.

[license]: ./LICENSE
[npm cli]: https://github.com/npm/cli