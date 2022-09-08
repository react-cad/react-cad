// eslint-disable-next-line @typescript-eslint/no-var-requires
const npsUtils = require("nps-utils");

module.exports = {
  scripts: {
    build: {
      default: "lerna run --stream build",
      ts: {
        default: npsUtils.series.nps("build.ts.core", "build.ts.nonCore"),
        core: "lerna run --stream --scope '@react-cad/core' build:ts-only",
        nonCore:
          "lerna run --stream --ignore '@react-cad/{core,examples}' build",
      },
    },
    default: "lerna run --parallel start",
    test: "jest --forceExit",
    lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    format:
      "prettier --write --ignore-unknown '**/*.{js,jsx,ts,tsx}' '**/tsconfig*.json'",
  },
};
