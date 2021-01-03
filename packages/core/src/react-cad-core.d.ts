export class EmClass {
  delete(): void;
}

export class Point extends EmClass {
}

export class Axis extends EmClass {
}

export class Space extends EmClass {
  public static Origin(): Point;
  public static OX(): Axis;
  public static OY(): Axis;
  public static OZ(): Axis;
}

export class Shape extends EmClass {
  public IsNull(): boolean;
}

export class Transform extends EmClass {
}

export class VectorShape extends EmClass {
  public size(): number;
  public push_back(element: Shape);
  public get(index: number): Shape;
}

export interface ReactCadEmscriptenModule extends EmscriptenModule {
  Space: typeof Space;
  Shape: typeof Shape;
  VectorShape: typeof VectorShape;
  cwrap: typeof cwrap;
  ccall: typeof ccall;
  _main(): number;
  _onFileDataRead(nameBuffer: number, dataBuffer: number, dataLength: number): null;
  makeBox(x: number, y: number, z: number): Shape;
  makeCylinder(radius: number, height: number): Shape;
  makeSphere(radius: number): Shape;
  makeTorus(radius1: number, radius2: number): Shape;
  makeRotation(axis: Axis, angle: number): Transform;
  makeTranslation(x: number, y: number, z: number): Transform;
  makeScale(factor: number): Transform;
  applyTransform(shape: Shape, transform: Transform): Shape;
  makeUnion(shapes: VectorShape): Shape;
  makeDifference(shapes: VectorShape): Shape;
  makeIntersection(shapes: VectorShape): Shape;
  clearShape(): void;
  setShape(shape: Shape): void;
  fitShape(): void;
  copyShape(shape: Shape): Shape;
  canvas: HTMLCanvasElement;
}

const reactCadCore: EmscriptenModuleFactory<ReactCadEmscriptenModule>;

export default reactCadCore;
