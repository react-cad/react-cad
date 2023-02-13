// Generated using webpack-cli https://github.com/webpack/webpack-cli
//
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { DefinePlugin } = require("webpack");

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = "style-loader";

const { version } = require("./package.json");

const config = {
  entry: {
    main: "./src/index.tsx",
    serviceworker: "./src/serviceworker.ts",
  },
  output: {
    path: path.resolve(__dirname, "lib"),
  },
  devServer: {
    open: true,
    host: "localhost",
  },
  optimization: {
    moduleIds: "named",
  },
  externals: {
    "@react-cad/create-sandbox": "promise window.createSandbox",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      entry: ["main", "serviceworker"],
    }),
    new CopyPlugin({
      patterns: [
        {
          from: "./sandbox",
          to: "sandbox",
        },
        {
          from: "../../node_modules/@typescript-deploys/monaco-editor/min/vs/",
          to: "vs",
        },
        {
          from: "../../node_modules/vscode-loader/src/loader.js",
          to: "vs.loader.js",
        },
        {
          from: "src/editor.js",
          to: "editor.js",
        },
      ],
    }),

    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new DefinePlugin({
      "process.env.REACTCAD_WASM": JSON.stringify(
        isProduction && !process.env.REACTCAD_LOCAL_WASM
          ? `https://unpkg.com/@react-cad/core@${version}/lib/react-cad-core.wasm`
          : ""
      ),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react", "@babel/preset-typescript"],
        },
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        test: /react-cad-core\.wasm$/,
        use: {
          loader: "file-loader",
          /*
          options: {
            emitFile:
              config.mode !== "production" || !!process.env.REACTCAD_LOCAL_WASM,
          },
          */
        },
      },
      {
        test: /react-cad-core\.js$/,
        use: "file-loader",
      },
      {
        test: /react-cad-core\.esm\.js$/,
        use: "file-loader",
      },
      {
        test: /react-cad-core\.worker\.js$/,
        use: "file-loader",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
