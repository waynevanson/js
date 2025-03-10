//@ts-check
import * as fs from "node:fs"
import * as path from "node:path"

const packageName =
  process.env["npm_package_name"] || process.env["PNPM_PACKAGE_NAME"]

if (!packageName) {
  throw new Error(
    `Expected there to be a package name but received "${packageName}"`
  )
}

const version = "${version}"

// includes scope and package name in the github release for the changelog.
const headerPartial = fs
  .readFileSync(path.resolve(import.meta.dirname, "./header.hbs"), {
    encoding: "utf8",
  })
  .replaceAll(/__PACKAGE_NAME__/g, packageName)

export default {
  branches: ["main"],
  tagFormat: `${packageName}@${version}`,
  repositoryUrl: "https://github.com/waynevanson/js.git",
  plugins: [
    // todo: add more field commits here
    "@semantic-release/commit-analyzer",
    [
      "@semantic-release/release-notes-generator",
      {
        writerOpts: {
          headerPartial,
        },
      },
    ],
    [
      "@semantic-release/npm",
      {
        tarballDir: "dist/",
        registry: "https://npm.pkg.github.com/",
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: "dist/*.tgz",
      },
    ],
  ],
}
