module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@react-cad/storybook-addon"],
  webpackFinal: config => {
    return { ...config, node: { fs: "empty" } };
  }
};
