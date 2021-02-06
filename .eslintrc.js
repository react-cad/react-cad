module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        ignoreRestSiblings: true,
        argsIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/no-empty-function": 0,
  },
  env: {
    node: true,
  },
};
