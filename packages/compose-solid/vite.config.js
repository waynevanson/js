//@ts-check
/// <reference types="vitest/config" />

import { defineConfig } from "vite"
import dts from "vite-plugin-dts"
import { externals } from "@waynevanson/vite-plugin-externals"
import solid from "vite-plugin-solid"

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
