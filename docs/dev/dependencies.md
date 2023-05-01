# Dependency management

This file contains the dependency management strategy used by the _npm-updatedt_
project.

## npm

This section contains the dependency management strategy for `npm` dependencies.

- Production/runtime dependencies should be specified at the minimum required
  version with the `^` prefix to allow end-users to use any later non-breaking
  release of the dependency if they so choose. The compatibility burden is put
  on the dependency, but if a dependency is known to release breaking changes a
  more narrow range may be applied.
- Development dependencies should always be specified at an exact version. When
  added it should be specified at the latest stable version available. Updates
  to development dependencies should be version controlled to aid with
  reproducibility.
- The `package-lock.json` file should be included in version control to aid with
  reproducibility. The lockfile version shall be fixed and recorded in `.npmrc`,
  only changing intentionally as a version controlled change in `.npmrc`.
- Dependencies shall not be vendored.

---

_Content licensed under [CC0]; Code snippets under the [MIT] license._

[cc0]: https://creativecommons.org/publicdomain/zero/1.0/
[mit]: https://opensource.org/license/mit/
