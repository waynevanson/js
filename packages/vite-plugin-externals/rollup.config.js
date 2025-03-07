import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"

export default defineConfig({
  input: "src/index.ts",
  output: { format: "esm", dir: "dist" },
  plugins: [typescript({})],
})
