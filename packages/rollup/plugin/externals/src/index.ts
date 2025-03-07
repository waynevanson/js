import type { Plugin } from "vite"
import * as fs from "node:fs"
import * as path from "node:path"

// todo: solid-js/* would mean solid-js/web too.
export interface ExternalsPluginOptions {
  dependencies?: boolean
  devDependencies?: boolean
  optionalDependencies?: boolean
  peerDependencies?: boolean
}

export function externals(options?: ExternalsPluginOptions): Plugin {
  const config = createConfig(options)
  return {
    name: "@waynevanson/rollup-plugin-externals",
    apply: "build",
    config() {
      const json = findClosestPackageJson()
      const external = createExternal(config, json)

      return { optimizeDeps: { exclude: external } }
    },
  }
}

function createConfig(
  options?: ExternalsPluginOptions
): Required<ExternalsPluginOptions> {
  return Object.assign({}, options ?? {}, {
    dependencies: false,
    devDependencies: false,
    optionalDependencies: false,
    peerDependencies: false,
  })
}

function createExternal(
  config: Required<ExternalsPluginOptions>,
  json: Record<string, any>
): Array<string> {
  return Object.keys(config)
    .filter((key) => config[key as keyof typeof config])
    .filter((key) => key in json)
    .flatMap((key) => Object.keys(json[key]!))
}

function findClosestPackageJson(
  start = process.cwd(),
  level = 0
): Record<string, any> {
  try {
    const contents = path.resolve(start, "package.json")
    const content = fs.readFileSync(contents, { encoding: "utf8" })
    return JSON.parse(content)
  } catch {
    return level >= 10
      ? {}
      : findClosestPackageJson(path.dirname(start), level + 1)
  }
}
