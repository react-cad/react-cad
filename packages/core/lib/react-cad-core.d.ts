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
export type Quaternion = [number, number, number, number];
export type Polygon = Point[];
export type Profile = Polygon | string;
export type AxisName = "x" | "y" | "z";
export type Matrix = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [0, 0, 0, 1],
];

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
  axis: AxisName;
  angle: number;
}
export class ReactCADRevolutionNode extends ReactCADSweepNode {
  public setProps(props: RevolutionProps): void;
}

export interface PrismProps {
  axis: AxisName;
  height: number;
}
export class ReactCADPrismNode extends ReactCADSweepNode {
  public setProps(props: PrismProps): void;
}

export class ReactCADEvolutionNode extends ReactCADNode {
  public setProfile(profile: Point[]): void;
  public setProfileSVG(pathData: string): void;
  public setSpine(spine: Point[]): void;
  public setSpineSVG(pathData: string): void;
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

export class ReactCADBRepImportNode extends ReactCADImportNode {}

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

export class ReactCADMirrorNode extends ReactCADNode {
  public setPlane(origin: Point, normal: Vector): void;
}
export class ReactCADAffineNode extends ReactCADNode {
  public setMatrix(matrix: Matrix): void;
}
export class ReactCADRotationNode extends ReactCADNode {
  public setAxisAngle(direction: Vector, angle: number): void;
  public setEulerAngles(x: number, y: number, z: number): void;
  public setRotation(quaternion: Quaternion): void;
}
export class ReactCADScaleNode extends ReactCADNode {
  public setCenter(center: Point): void;
  public setScaleFactor(scaleFactor: number): void;
  public setScale(scale: Vector): void;
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
  evolution: ReactCADEvolutionNode;
  revolution: ReactCADRevolutionNode;
  brep: ReactCADBRepImportNode;
  step: ReactCADSTEPImportNode;
  stl: ReactCADSTLImportNode;
  obj: ReactCADObjImportNode;
  affine: ReactCADAffineNode;
  mirror: ReactCADMirrorNode;
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
