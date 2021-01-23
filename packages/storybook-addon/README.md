# @react-cad/storybook-addon

A preset to preview @react-cad components in Storybook.

## Usage

Preferably, create a component with `@react-cad/create-component`.

Alternatively, set up a React Storybook in the usual way, and add the addon to `.storybook/main.js`:

```
module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@react-cad/storybook-addon",
  ],
};
```
