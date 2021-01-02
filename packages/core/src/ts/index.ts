/// <reference types="emscripten" />
import reactCadCoreWasm from "./react-cad-core.wasm";
import reactCadCore, { ReactCadCoreModule } from "./react-cad-core";

export * from "./react-cad-core";

const createViewer: EmscriptenModuleFactory<ReactCadCoreModule> = Module =>
  reactCadCore({
    ...Module,
    locateFile: () => reactCadCoreWasm,
  });

export default createViewer;
