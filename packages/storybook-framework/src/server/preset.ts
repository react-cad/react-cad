import type { StorybookConfig } from "@storybook/core-common";

export const addons: StorybookConfig["addons"] = [
  require.resolve("./framework-preset-react-cad"),
  require.resolve("./framework-preset-react-cad-docs"),
];

export const managerHead = (
  head: string,
  config: { configType: string }
): string => {
  return config.configType === "PRODUCTION"
    ? `<script src="coi-serviceworker.js"></script>${head}`
    : head;
};

export const managerEntries = [require.resolve("./theme")];
