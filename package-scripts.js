// eslint-disable-next-line @typescript-eslint/no-var-requires
const npsUtils = require("nps-utils");

module.exports = {
  scripts: {
    build: {
      default: "lerna run --stream build",
      core: {
        ts: "lerna run --stream --scope '@react-cad/core' build:ts-only",
      },
      test: {
        ts: "lerna run --stream --ignore '@react-cad/{core,examples}' build",
        ci: npsUtils.series.nps("build.core.ts", "build.test.ts"),
      },
    },
    default: "lerna run --parallel start",
    test: "jest --detectOpenHandles",
    lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    format:
      "prettier --write --ignore-unknown '**/*.{js,jsx,ts,tsx}' '**/tsconfig*.json'",
  },
};
