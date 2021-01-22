export class EmClass {
  delete(): void;
}

export class Shape extends EmClass {
  public IsNull(): boolean;
}

export class ReactCADNode extends EmClass {
  public setProps(props: any): void;
  public appendChild(child: ReactCadNode): void;
  public insertChildBefore(child: ReactCadNode, before: ReactCadNode): void;
  public removeChild(child: ReactCadNode): void;
  public render(): void;
  public shape: Shape;
  public needsRender: boolean;
  public hasParent(): boolean;
}

export class ReactCADView extends EmClass {
  public addNode(node: ReactCADNode): void;
  public removeNode(node: ReactCADNode): void;
  public renderNodes(): void;
  public fit(): void;
}

export class Point extends EmClass {}

export class Axis extends EmClass {}

export class Space extends EmClass {
  public static Origin(): Point;
  public static OX(): Axis;
  public static OY(): Axis;
  public static OZ(): Axis;
}

export class Transform extends EmClass {}

export class VectorShape extends EmClass {
  public size(): number;
  public push_back(element: Shape): void;
  public get(index: number): Shape;
}

export interface ReactCadEmscriptenModule extends EmscriptenModule {
  ReactCADNode: typeof ReactCADNode;
  ReactCADView: typeof ReactCADView;
  createCADNode(type: string): ReactCADNode;
  getView(): ReactCADView;
  cwrap: typeof cwrap;
  ccall: typeof ccall;
  canvas: HTMLCanvasElement;
}

declare const reactCadCore: EmscriptenModuleFactory<ReactCadEmscriptenModule>;

export default reactCadCore;
