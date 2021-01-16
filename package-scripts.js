// eslint-disable-next-line @typescript-eslint/no-var-requires
const npsUtils = require("nps-utils");

module.exports = {
  scripts: {
    build: {
      default: "lerna run --stream build",
      coreTs: "lerna run --stream --scope '@react-cad/core' build:ts-only",
      testTs: "lerna run --stream --ignore '@react-cad/{core,examples}' build",
      ci: {
        test: npsUtils.series.nps("build.coreTs", "build.testTs"),
      },
    },
    default: "lerna run --parallel start",
    test: "jest --detectOpenHandles",
    lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    format:
      "prettier --write --ignore-unknown '**/*.{js,jsx,ts,tsx}' '**/tsconfig*.json'",
  },
};
