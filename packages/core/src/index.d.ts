/// <reference types="emscripten" />

export interface Shape {
  delete(): void;
}

export interface ReactCadCoreModule extends EmscriptenModule {
  Shape: Shape;
  cwrap: typeof cwrap;
  ccall: typeof ccall;
  _main(): number;
  _onFileDataRead(nameBuffer: number, dataBuffer: number, dataLength: number): null;
  makeBox(x: number, y: number, z: number): Shape;
  clearShape(): void;
  setShape(shape: Shape): void;
  canvas: HTMLCanvasElement;
}

declare const ModuleFactory: EmscriptenModuleFactory<ReactCadCoreModule>;

export default ModuleFactory;
