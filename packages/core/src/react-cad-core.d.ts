export class EmClass {
  delete(): void;
}

export class ReactCADNode extends EmClass {
  public appendChild(child: ReactCADNode): void;
  public insertChildBefore(child: ReactCADNode, before: ReactCADNode): void;
  public removeChild(child: ReactCADNode): void;
  public hasParent(): boolean;
  public renderTree(): void;
}

export type Axis = "x" | "y" | "z";
export type Point = [number, number, number];
export type Profile = Point[];
export type Projection = number & { _opaque: typeof Projection };
export type Viewpoint = number & { _opaque: typeof Viewpoint };

// Primitives
export interface BoxProps {
  center: boolean;
  x: number;
  y: number;
  z: number;
}
export class ReactCADBoxNode extends ReactCADNode {
  public setProps(props: BoxProps): void;
}

export interface CylinderProps {
  center: boolean;
  radius: number;
  height: number;
}
export class ReactCADCylinderNode extends ReactCADNode {
  public setProps(props: CylinderProps): void;
}

export interface SphereProps {
  radius: number;
}
export class ReactCADSphereNode extends ReactCADNode {
  public setProps(props: SphereProps): void;
}

export interface TorusProps {
  radius1: number;
  radius2: number;
}
export class ReactCADTorusNode extends ReactCADNode {
  public setProps(props: TorusProps): void;
}

// Sweeps
export class ReactCADSweepNode extends ReactCADNode {
  public setProfile(path: Profile): void;
}

export interface RevolutionProps {
  axis: Axis;
  angle: number;
}
export class ReactCADRevolutionNode extends ReactCADSweepNode {
  public setProps(props: RevolutionProps): void;
}

export interface PrismProps {
  axis: Axis;
  height: number;
}
export class ReactCADPrismNode extends ReactCADSweepNode {
  public setProps(props: PrismProps): void;
}

export interface HelixProps {
  pitch: number;
  height: number;
}
export class ReactCADHelixNode extends ReactCADSweepNode {
  public setProps(props: HelixProps): void;
}

// Transformations
export interface TranslationProps {
  x: number;
  y: number;
  z: number;
}
export class ReactCADTranslationNode extends ReactCADNode {
  public setProps(props: TranslationProps): void;
}

export interface RotationProps {
  axis: Axis;
  angle: number;
}
export class ReactCADRotationNode extends ReactCADNode {
  public setProps(props: RotationProps): void;
}
export interface ScaleProps {
  factor: number;
}
export class ReactCADScaleNode extends ReactCADNode {
  public setProps(props: ScaleProps): void;
}

export interface ReactCADCore extends EmscriptenModule {
  ReactCADNode: typeof ReactCADNode;
  ReactCADView: typeof ReactCADView;
  Projection: {
    ORTHOGRAPHIC: Projection;
    PERSPECTIVE: Projection;
  };
  Viewpoint: {
    TOP: Viewpoint;
    BOTTOM: Viewpoint;
    LEFT: Viewpoint;
    RIGHT: Viewpoint;
    FRONT: Viewpoint;
    BACK: Viewpoint;
  };
  createCADNode(type: string): ReactCADNode;
  setNode(node: ReactCADNode): void;
  removeNode(node: ReactCADNode): void;
  render(): void;
  // setColor(color: string): void;
  zoom(delta: number): void;
  setViewpoint(viewpoint: Viewpoint): void;
  resetView(): void;
  fit(): void;
  setProjection(projection: Projection): void;
  showAxes(show: boolean): void;
  showGrid(show: boolean): void;
  showWireframe(show: boolean): void;
  showShaded(show: boolean): void;
  onResize(): void;
  writeSTL(
    node: ReactCADNode,
    filename: string,
    linearDeflection: number,
    isRelative: boolean,
    angularDeflection: number
  ): boolean;
  cwrap: typeof cwrap;
  ccall: typeof ccall;
  canvas: HTMLCanvasElement;
  FS: {
    readFile(
      path: string,
      opts: { encoding: "binary"; flags?: string }
    ): Uint8Array;
    readFile(path: string, opts: { encoding: "utf8"; flags?: string }): string;
    readFile(path: string, opts?: { flags?: string }): Uint8Array;
    unlink(path: string): void;
  };
  _shutdown(): void;
}

declare const reactCadCore: EmscriptenModuleFactory<ReactCADCore>;

export default reactCadCore;
