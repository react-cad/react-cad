module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@react-cad/storybook-framework",
  core: {
    builder: "webpack5",
  },
  reactOptions: {
    fastRefresh: false,
  },
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.(brep|step|ast|obj)$/,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.(png|jpg)$/,
      type: "asset/resource",
    });

    return config;
  },
};
