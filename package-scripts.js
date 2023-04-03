// eslint-disable-next-line @typescript-eslint/no-var-requires
module.exports = {
  scripts: {
    build: {
      default: "lerna run --stream build",
      ts:
        "lerna run --stream --ignore '@react-cad/{core,examples,docs,playground}' build",
      web:
        "lerna run --stream --scope '@react-cad/{docs,playground}' build && mv packages/playground/lib packages/docs/storybook-static/playground",
    },
    default:
      "lerna run --ignore '@react-cad/{docs,examples,playground,storybook-framework}' --parallel start",
    test: "jest --forceExit",
    lint: "eslint . --ext .js,.jsx,.ts,.tsx",
    format:
      "prettier --write --ignore-unknown '**/*.{js,jsx,ts,tsx}' '**/tsconfig*.json'",
  },
};
