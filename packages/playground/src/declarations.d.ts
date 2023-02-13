declare module "@react-cad/create-sandbox" {
  import { SandboxConfig, createTypeScriptSandbox } from "@typescript/sandbox";
  const createSandbox: (
    config: Partial<SandboxConfig>
  ) => ReturnType<typeof createTypeScriptSandbox>;
  export default createSandbox;
}

declare module "!!raw-loader!@react-cad/renderer/lib/types.d.ts" {
  const url: string;
  export default url;
}

declare module "!!raw-loader!react-cad/types/jsx/index.d.ts" {
  const url: string;
  export default url;
}

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

declare module "*.module.css";
