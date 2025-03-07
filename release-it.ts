// This runs per package
// just get the name, find a version using conventional commits, update package json, release.
// should be built.
import type { Config } from "release-it"

// research how to integrate the conventional changelog
// integrate test script
// integrate lint-staged
// setup ci

const [scope, name] = process.env["npm_package_name"]!.split("/")
const version = "${version}"
const full = `${scope}/${name}@${version}`

export default {
  git: {
    commitMessage: `[skip ci] Release ${full}`,
    tagAnnotation: full,
    tagName: full,
  },
  github: {
    release: true,
  },
  npm: {
    publish: true,
  },
} satisfies Config
