//@ts-check
import { defineConfig, mergeConfig } from "vite"
import solid from "vite-plugin-solid"
import { externals } from "@waynevanson/rollup-plugin-externals"
import dts from "vite-plugin-dts"

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.tsx",
      formats: ["es"],
      fileName: () => "index.mjs",
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
