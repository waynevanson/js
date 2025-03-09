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
const headerPartial = fs
  .readFileSync(path.resolve(import.meta.dirname, "./header.hbs"), {
    encoding: "utf8",
  })
  .replaceAll(/__PACKAGE_NAME__/g, packageName)

export default {
  branches: ["main"],
  tagFormat: `${version}`,
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
    ["@semantic-release/github", {}],
  ],
}
