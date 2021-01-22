module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@react-cad/storybook-addon",
  ],
  webpackFinal: (config) => {
    config.module.rules.push({
      test: /react-cad-core\.wasm$/,
      type: "javascript/auto",
      loader: "file-loader",
    });

    config.node = { fs: "empty" };

    return config;
  },
};
