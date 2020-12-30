/// <reference types="emscripten" />

export interface ReactCascadeCoreModule extends EmscriptenModule {
  cwrap: typeof cwrap;
  ccall: typeof ccall;
  _main(): number;
  _onFileDataRead(nameBuffer: number, dataBuffer: number, dataLength: number): null;
  canvas: HTMLCanvasElement;
}

declare const ModuleFactory: EmscriptenModuleFactory<ReactCascadeCoreModule>;

export default ModuleFactory;
