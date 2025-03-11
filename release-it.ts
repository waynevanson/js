// This runs per package
// just get the name, find a version using conventional commits, update package json, release.
// should be built.
import path from "node:path"
import { Config } from "release-it"

const packageName = process.env["npm_package_name"]!.split("/")
const version = "${version}"
const full = `${packageName}@${version}`

// todo: command to find root
const root = path.dirname(path.dirname(process.cwd()))
// packages/<name>
const commitsPath = path.relative(root, process.cwd())

export default {
  git: {
    commitMessage: `Release ${full} [skip ci]`,
    tagAnnotation: full,
    tagName: full,
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
      gitRawCommitsOpts: {
        path: commitsPath,
      },
    },
  },
} satisfies Config
