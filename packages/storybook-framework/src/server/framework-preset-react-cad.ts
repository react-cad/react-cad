import path from "path";
import { findEsm } from "./findEsm";
import { TransformOptions } from "@babel/core";
import type { Configuration } from "webpack";
import type { StorybookConfig } from "@storybook/core-common";

export {
  babel,
  webpackFinal,
} from "@storybook/react/dist/cjs/server/framework-preset-react";

const rendererDirName = path.dirname(
  require.resolve("@react-cad/storybook-framework/package.json")
);
// TODO: improve node_modules detection
const context = rendererDirName.includes("node_modules")
  ? path.join(rendererDirName, "../../") // Real life case, already in node_modules
  : path.join(rendererDirName, "../../node_modules"); // ReactCAD Monorepo

const hasJsxRuntime = () => {
  try {
    require.resolve("react/jsx-runtime", { paths: [context] });
    return true;
  } catch (e) {
    return false;
  }
};

export async function babelDefault(
  config: TransformOptions
): Promise<TransformOptions> {
  const presetReactOptions = hasJsxRuntime() ? { runtime: "automatic" } : {};

  return {
    ...config,
    presets: [
      ...(config?.presets || []),
      [require.resolve("@babel/preset-react"), presetReactOptions],
    ],
    plugins: [
      ...(config?.plugins || []),
      require.resolve("babel-plugin-add-react-displayname"),
    ],
  };
}

export function webpack(config: Configuration): Configuration {
  config.module?.rules?.push({
    test: /react-cad-core\.wasm$/,
    type: "asset/resource",
  });

  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      fs: false,
      path: false,
    },
  };

  return config;
}

export const previewAnnotations: StorybookConfig["previewAnnotations"] = (
  entry = []
) => {
  return [...entry, findEsm(__dirname, "client/preview/config")];
};
