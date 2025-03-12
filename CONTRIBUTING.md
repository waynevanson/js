## Development Environment

> Note: Only systems that can install the package manager `nix` are supported.

### Release management

We're using `release-it` for releasing packages.

To add something to a release:

1. Apply `publishConfig.registry: "https://npm.pkg.github.com"` to the packages' `package.json`.
2. Symlink the `/.release-it.ts` to `/packages/<package>/.release-it.ts` via `ln -s .release-it.ts packages/<package>/`
3. Push. The CI pipeline will now release the package.
