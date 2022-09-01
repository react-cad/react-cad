declare module "global";

// will be provided by the webpack define plugin
declare let NODE_ENV: string | undefined;

declare module "@react-cad/core/lib/react-cad-core.wasm" {
  const wasmUrl: string;
  export default wasmUrl;
}

declare module "@react-cad/core/lib/react-cad-core" {
  const jsUrl: string;
  export default jsUrl;
}

declare module "@react-cad/core/lib/react-cad-core.esm" {
  const jsUrl: string;
  export default jsUrl;
}

declare module "@react-cad/core/lib/react-cad-core.worker" {
  const workerUrl: string;
  export default workerUrl;
}

declare module "@storybook/react/dist/esm/client/docs/jsxDecorator" {
  export * from "@storybook/react/dist/ts3.9/client/docs/jsxDecorator";
}

declare module "@storybook/react/dist/esm/client/docs/extractArgTypes" {
  export * from "@storybook/react/dist/ts3.9/client/docs/extractArgTypes";
}

declare module "@storybook/react/dist/cjs/server/framework-preset-react" {
  export * from "@storybook/react/dist/ts3.9/server/framework-preset-react";
}

declare module "@storybook/react/dist/cjs/server/framework-preset-react-docs" {
  export * from "@storybook/react/dist/ts3.9/server/framework-preset-react-docs";
}
