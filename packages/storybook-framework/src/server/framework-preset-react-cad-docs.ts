import type { StorybookConfig } from "@storybook/core-common";
import { findEsm } from "./findEsm";
import { hasDocsOrControls } from "@storybook/docs-tools";

export {
  babel,
  webpackFinal,
} from "@storybook/react/dist/cjs/server/framework-preset-react-docs";

export const previewAnnotations: StorybookConfig["previewAnnotations"] = (
  entry = [],
  options
) => {
  if (!hasDocsOrControls(options)) return entry;
  return [...entry, findEsm(__dirname, "client/docs/config")];
};
