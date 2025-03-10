//@ts-check
import * as path from "node:path"

const packageName =
  process.env["npm_package_name"] || process.env["PNPM_PACKAGE_NAME"]

if (!packageName) {
  throw new Error(
    `Expected there to be a package name but received "${packageName}"`
  )
}

const version = "${version}"
const commitPathPatterns = [path.resolve("./**")]

export default {
  branches: ["main"],
  tagFormat: `${packageName}@${version}`,
  repositoryUrl: "https://github.com/waynevanson/js.git",
  plugins: [
    // todo: add more field commits here
    [
      "@semantic-release/commit-analyzer",
      {
        commitPathPatterns,
      },
    ],
    "@semantic-release/release-notes-generator",
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
