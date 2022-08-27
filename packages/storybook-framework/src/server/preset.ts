import type { StorybookConfig } from "@storybook/core-common";

export const addons: StorybookConfig["addons"] = [
  require.resolve("./framework-preset-react-cad"),
  require.resolve("./framework-preset-react-cad-docs"),
];
