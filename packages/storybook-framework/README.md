# @react-cad/storybook-framework

A framework to view @react-cad components in Storybook.

## Usage

Preferably, create a component with `@react-cad/create-component`.

Alternatively, set up a React Storybook in the usual way, add the framework to `.storybook/main.js` and use the webpack 5 builder:

```
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  framework: "@react-cad/storybook-framework",
  core: {
    builder: "webpack5",
  },
};
```
