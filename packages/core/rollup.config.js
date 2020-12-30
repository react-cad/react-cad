import { wasm } from "@rollup/plugin-wasm";

export default {
  input: "src/index.js",
  output: {
    file: "lib/index.js",
    format: "es"
  },
  plugins: [wasm({ sync: ["build/react-cascade-core.wasm"] })]
};
