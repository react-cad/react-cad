import type { StorybookConfig } from "@storybook/core-common";

export const addons: StorybookConfig["addons"] = [
  require.resolve("./framework-preset-react-cad"),
  require.resolve("./framework-preset-react-cad-docs"),
];

export const previewHead = (head: string): string => `
  <script>
    window.coi = {
      doReload: () => window.parent.location.reload(),
    };
  </script>
  <script src="coi-serviceworker.js"></script>
  ${head}
`;
