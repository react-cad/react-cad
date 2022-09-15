// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  scripts: {
    build: {
      default: "lerna run --stream build",
      ts: "lerna run --stream --ignore '@react-cad/{core,examples}' build",
    },
    default: "lerna run --parallel start",
    test: "jest --forceExit",
    lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    format:
      "prettier --write --ignore-unknown '**/*.{js,jsx,ts,tsx}' '**/tsconfig*.json'",
  },
};
