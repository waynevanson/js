import { Config } from "release-it"

console.info("`release-it` config read from the root")

const packageName =
  process.env["npm_package_name"] || process.env["PNPM_PACKAGE_NAME"]

const version = "${version}"
const full = `${packageName}@${version}`

console.log("Working on releasing package %s", packageName)

export default {
  git: {
    commitMessage: `chore(ci): release ${full} [skip ci]`,
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
