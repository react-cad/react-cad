module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@react-cad/storybook-framework",
  core: {
    builder: "webpack5",
  },
  reactOptions: {
    fastRefresh: true,
  },
};
