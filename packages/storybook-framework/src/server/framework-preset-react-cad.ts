import path from "path";
import { findEsm } from "./findEsm";
import { TransformOptions } from "@babel/core";
import { DefinePlugin, Configuration } from "webpack";
import CopyPlugin from "copy-webpack-plugin";
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
    use: "file-loader",
  });
  config.module?.rules?.push({
    test: /react-cad-core\.js$/,
    use: "file-loader",
  });
  config.module?.rules?.push({
    test: /react-cad-core\.esm\.js$/,
    use: "file-loader",
  });
  config.module?.rules?.push({
    test: /react-cad-core\.worker\.js$/,
    use: "file-loader",
  });

  if (config.mode === "production") {
    // eslint-disable-next-line
    const { version } = require("../../package.json");

    if (!process.env.REACTCAD_LOCAL_WASM) {
      // Serve WASM from CDN in production
      config.plugins?.push(
        new DefinePlugin({
          "process.env.REACTCAD_WASM": JSON.stringify(
            `https://unpkg.com/@react-cad/core@${version}/lib/react-cad-core.wasm`
          ),
        })
      );
    }

    // Service worker to add COOP/COEP headers
    config.plugins?.push(
      new CopyPlugin({
        patterns: [
          {
            from: require.resolve("coi-serviceworker"),
            to: "coi-serviceworker.js",
          },
        ],
      })
    );
  }

  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      fs: false,
      path: false,
      "perf-hooks": false,
    },
  };

  return config;
}

export const previewAnnotations: StorybookConfig["previewAnnotations"] = (
  entry = []
) => {
  return [...entry, findEsm(__dirname, "client/preview/config")];
};
