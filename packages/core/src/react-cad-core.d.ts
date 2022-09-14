export class EmClass {
  delete(): void;
}

export class ReactCADNode extends EmClass {
  public appendChild(child: ReactCADNode): void;
  public insertChildBefore(child: ReactCADNode, before: ReactCADNode): void;
  public removeChild(child: ReactCADNode): void;
  public hasParent(): boolean;
}

export type Vector = [number, number, number];
export type Point = [number, number, number];
export type Polygon = Point[];
export type Profile = Polygon | string;
export type Axis = "x" | "y" | "z";

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

export interface WedgePropsLtx {
  x: number;
  y: number;
  z: number;
  ltx: number;
}
export interface WedgePropsMinMax {
  x: number;
  y: number;
  z: number;
  xmin: number;
  xmax: number;
  zmin: number;
  zmax: number;
}
export class ReactCADWedgeNode extends ReactCADNode {
  public setPropsLtx(props: WedgePropsLtx): void;
  public setPropsMinMax(props: WedgePropsMinMax): void;
}

export interface ConeProps {
  center: boolean;
  radius1: number;
  radius2: number;
  height: number;
  angle: number;
}
export class ReactCADConeNode extends ReactCADNode {
  public setProps(props: ConeProps): void;
}

export interface CylinderProps {
  center: boolean;
  radius: number;
  height: number;
  angle: number;
}
export class ReactCADCylinderNode extends ReactCADNode {
  public setProps(props: CylinderProps): void;
}

export interface SphereProps {
  radius: number;
  angle: number;
  segmentAngle1: number;
  segmentAngle2: number;
}
export class ReactCADSphereNode extends ReactCADNode {
  public setProps(props: SphereProps): void;
}

export interface TorusProps {
  radius1: number;
  radius2: number;
  angle: number;
}
export class ReactCADTorusNode extends ReactCADNode {
  public setProps(props: TorusProps): void;
}

export class ReactCADPolyhedronNode extends ReactCADNode {
  public setPointsAndFaces(points: Point[], faces: number[][]): void;
}

// Sweeps
export class ReactCADSweepNode extends ReactCADNode {
  public setProfile(path: Polygon): void;
  public setSVGProfile(svg: string): void;
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

// Imports
export class ReactCADImportNode extends ReactCADNode {
  public setFilename(src: string, ownFile: boolean): void;
  public getFilename(): string;
}

export class ReactCADSTEPImportNode extends ReactCADImportNode {}

export class ReactCADSTLImportNode extends ReactCADImportNode {}

export class ReactCADObjImportNode extends ReactCADImportNode {}

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

export interface ReactCADNodeTypes {
  box: ReactCADBoxNode;
  cone: ReactCADConeNode;
  cylinder: ReactCADCylinderNode;
  polyhedron: ReactCADPolyhedronNode;
  sphere: ReactCADSphereNode;
  torus: ReactCADTorusNode;
  wedge: ReactCADWedgeNode;
  difference: ReactCADNode;
  intersection: ReactCADNode;
  union: ReactCADNode;
  helix: ReactCADHelixNode;
  prism: ReactCADPrismNode;
  revolution: ReactCADRevolutionNode;
  step: ReactCADSTEPImportNode;
  stl: ReactCADSTLImportNode;
  obj: ReactCADObjImportNode;
  rotation: ReactCADRotationNode;
  scale: ReactCADScaleNode;
  translation: ReactCADTranslationNode;
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
  createCADNode<T extends keyof ReactCADNodeTypes = "union">(
    type: T
  ): ReactCADNodeTypes[T];
  render(node: ReactCADNode, reset = false): void;
  // setColor(color: string): void;
  zoom(delta: number): void;
  setViewpoint(viewpoint: Viewpoint): void;
  resetView(): void;
  fit(): void;
  setQuality(deviationCoefficent: number, angle: number): void;
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
  mainScriptUrlOrBlob?: string;
  FS: {
    readFile(
      path: string,
      opts: { encoding: "binary"; flags?: string }
    ): Uint8Array;
    readFile(path: string, opts: { encoding: "utf8"; flags?: string }): string;
    readFile(path: string, opts?: { flags?: string }): Uint8Array;
    writeFile(
      path: string,
      data: string | ArrayBufferView,
      opts?: { flags?: string }
    ): void;
    unlink(path: string): void;
  };
  _shutdown(): void;
}

declare const reactCadCore: EmscriptenModuleFactory<ReactCADCore>;

export default reactCadCore;
