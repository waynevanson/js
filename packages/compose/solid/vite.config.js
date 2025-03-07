//@ts-check
import { defineConfig, mergeConfig } from "vite"
import solid from "vite-plugin-solid"
import { externals } from "@waynevanson/rollup-plugin-externals"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.tsx",
      formats: ["es", "cjs"],
      fileName: resolveFileName,
      name: "index",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/store", "solid-js/web"],
    },
    minify: false,
  },
  plugins: [
    solid(),
    dts({ insertTypesEntry: true }),
    externals({
      devDependencies: true,
      optionalDependencies: true,
      peerDependencies: true,
    }),
  ],
})

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
