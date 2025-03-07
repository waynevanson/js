//@ts-check
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import { produce } from "immer"
import * as fs from "node:fs"
import * as path from "node:path"
import externalise from "rollup-plugin-peer-deps-external"
import dts from "vite-plugin-dts"

export default defineConfig({
  plugins: [solid({}), solidify(), dts({ insertTypesEntry: true })],
})

/**
 * @returns {import("vite").Plugin}
 */
export function solidify() {
  return {
    name: "solid-library",
    config(config, env) {
      const json = readPackageJson(config.root)

      const external = [
        ...Object.keys(json.peerDependencies ?? {}),
        ...Object.keys(json.optionalDependencies ?? {}),
        ...Object.keys(json.dependencies ?? {}),
        ...Object.keys(json.devDependencies ?? {}),
        "solid-js",
        "solid-js/store",
        "solid-js/web",
      ]

      return {
        build: {
          lib: {
            entry: "src/index.tsx",
            formats: ["es", "cjs"],
            fileName: resolveFileName,
          },
          rollupOptions: {
            external,
          },
          minify: false,
        },
      }
    },
  }
}

function readPackageJson(root) {
  return JSON.parse(
    fs.readFileSync(path.resolve(root ?? process.cwd(), "package.json"), {
      encoding: "utf8",
    })
  )
}

function resolveFileName(moduleFormat, entryName) {
  let extension = ""
  switch (moduleFormat) {
    case "es":
      extension = "mjs"
      break
    case "cjs":
      extension = "cjs"
      break
    default:
      throw new Error(
        `Expected to moduleFormat to be es or cjs, received ${moduleFormat}`
      )
  }

  return `${entryName}.${extension}`
}
