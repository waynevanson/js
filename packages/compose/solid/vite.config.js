import { defineConfig } from "vite"
import solid from "rollup-preset-solid"

const rollupOptions = solid({
  input: "src/index.tsx",
})

rollupOptions.output.forEach((output) => {
  delete output.sourcemap
})

export default defineConfig({
  build: { rollupOptions, sourcemap: true },
})
