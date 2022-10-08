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
  webpackFinal: async (config, { configType }) => {
    config.module.rules.push({
      test: /\.brep$/,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.step$/,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.ast$/,
      type: "asset/source",
    });
    config.module.rules.push({
      test: /\.obj$/,
      type: "asset/source",
    });

    return config;
  },
};
