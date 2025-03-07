import { defineConfig } from "rollup"
import typescript from "@rollup/plugin-typescript"
import dts from "rollup-plugin-dts"

export default defineConfig({
  input: "src/index.ts",
  output: { format: "esm", dir: "dist" },
  plugins: [typescript(), dts()],
})
