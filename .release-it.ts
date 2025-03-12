// This runs per package
// just get the name, find a version using conventional commits, update package json, release.
// should be built.
import path from "node:path"
import { Config } from "release-it"

console.info("`release-it` config read from the root")

const packageName =
  process.env["npm_package_name"] || process.env["PNPM_PACKAGE_NAME"]

const version = "${version}"
const full = `${packageName}@${version}`

console.log("Working on releasing package %s", packageName)

// todo: command to find root
const root = path.dirname(path.dirname(process.cwd()))
// packages/<name>
const commitsPath = path.relative(root, process.cwd())

export default {
  git: {
    commitMessage: `Release ${full} [skip ci]`,
    tagAnnotation: full,
    tagName: full,
    commitsPath: process.cwd(),
    requireCommits: true,
    requireCommitsFail: false,
  },
  github: {
    release: true,
    releaseName: full,
  },
  npm: {
    publish: true,
    allowSameVersion: true,
    // publishArgs: ["--userconfig", path.resolve(root, "./.npmrc.ci")],
    // versionArgs: ["--userconfig", path.resolve(root, "./.npmrc.ci")],
  },
  plugins: {
    "@release-it/conventional-changelog": {
      preset: {
        name: "angular",
      },
      infile: "CHANGELOG.md",
    },
  },
} satisfies Config
