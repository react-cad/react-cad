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
      type: "asset/inline",
      generator: {
        dataUrl: {
          mimetype: "application/octet-stream",
        },
      },
    });
    config.module.rules.push({
      test: /\.step$/,
      type: "asset/inline",
      generator: {
        dataUrl: {
          mimetype: "application/STEP",
        },
      },
    });
    config.module.rules.push({
      test: /\.stl$/,
      type: "asset/inline",
      generator: {
        dataUrl: {
          mimetype: "application/sla",
        },
      },
    });
    config.module.rules.push({
      test: /\.obj$/,
      type: "asset/inline",
      generator: {
        dataUrl: {
          mimetype: "application/octet-stream",
        },
      },
    });

    return config;
  },
};
