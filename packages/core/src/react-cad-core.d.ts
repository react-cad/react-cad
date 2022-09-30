export class EmClass {
  delete(): void;
}

export class ReactCADNode extends EmClass {
  public appendChild(child: ReactCADNode): void;
  public insertChildBefore(child: ReactCADNode, before: ReactCADNode): void;
  public removeChild(child: ReactCADNode): void;
  public hasParent(): boolean;
}

export class ReactCADView extends EmClass {
  public render(node: ReactCADNode, reset: boolean): void;
  // public setColor(color: string): void;
  public zoom(delta: number): void;
  public setViewpoint(viewpoint: Viewpoint): void;
  public resetView(): void;
  public fit(): void;
  public setQuality(deviationCoefficent: number, angle: number): void;
  public setProjection(projection: Projection): void;
  public showAxes(show: boolean): void;
  public showGrid(show: boolean): void;
  public showWireframe(show: boolean): void;
  public showShaded(show: boolean): void;
  public onResize(): void;
}

export type Vector = [number, number, number];
export type Point = [number, number, number];
export type Quaternion = [number, number, number, number];
export type Polygon = Point[];
export type Profile = Polygon | string;
export type Matrix = [
  [number, number, number, number],
  [number, number, number, number],
  [number, number, number, number],
  [0, 0, 0, 1]
];

declare const Projection: unique symbol;
export type Projection = number & { _opaque: typeof Projection };
declare const Viewpoint: unique symbol;
export type Viewpoint = number & { _opaque: typeof Viewpoint };

// Primitives
export class ReactCADBoxNode extends ReactCADNode {
  public setSize(size: Vector): void;
  public setCentered(centered: boolean): void;
}

export class ReactCADWedgeNode extends ReactCADNode {
  public setSize(size: Vector): void;
  public setLtx(ltx: number): void;
  public setMinMax(
    xmin: number,
    xmax: number,
    zmin: number,
    zmax: number
  ): void;
}

export class ReactCADConeNode extends ReactCADNode {
  public setSize(radius1: number, radius2: number, height: number): void;
  public setAngle(angle: number): void;
  public setCentered(centered: boolean): void;
}

export class ReactCADCylinderNode extends ReactCADNode {
  public setSize(radius: number, height: number): void;
  public setAngle(angle: number): void;
  public setCentered(centered: boolean): void;
}

export class ReactCADSphereNode extends ReactCADNode {
  public setRadius(radius: number): void;
  public setAngle(angle: number): void;
  public setSegment(angle1: number, angle2: number): void;
}

export class ReactCADTorusNode extends ReactCADNode {
  public setSize(radius1: number, radius2: number): void;
  public setAngle(angle: number): void;
}

export class ReactCADPolyhedronNode extends ReactCADNode {
  public setPointsAndFaces(points: Point[], faces: number[][]): void;
}

// Sweeps
export class ReactCADSweepNode extends ReactCADNode {
  public setProfile(path: Polygon): void;
  public setProfileSVG(svg: string): void;
}

export class ReactCADRevolutionNode extends ReactCADSweepNode {
  public setAxisAngle(axis: Vector, angle: number): void;
}

export class ReactCADPrismNode extends ReactCADSweepNode {
  public setVector(vector: Vector): void;
}

export class ReactCADEvolutionNode extends ReactCADNode {
  public setProfile(profile: Point[]): void;
  public setProfileSVG(pathData: string): void;
  public setSpine(spine: Point[]): void;
  public setSpineSVG(svg: string): void;
}

export class ReactCADPipeNode extends ReactCADSweepNode {
  public setSpine(spine: Point[]): void;
  public setSpineSVG(pathData: string): void;
}

export class ReactCADHelixNode extends ReactCADSweepNode {
  public setPitch(pitch: number): void;
  public setHeight(height: number): void;
}

// Imports
export class ReactCADImportNode extends ReactCADNode {
  public setFileContents(contents: string | ArrayBuffer): void;
}

export class ReactCADBRepImportNode extends ReactCADImportNode {}

export class ReactCADSTEPImportNode extends ReactCADImportNode {}

export class ReactCADSTLImportNode extends ReactCADImportNode {}

export class ReactCADObjImportNode extends ReactCADImportNode {}

// Transformations
export class ReactCADTranslationNode extends ReactCADNode {
  public setVector(vector: Vector): void;
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
  pipe: ReactCADPipeNode;
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
  createView(canvas: HTMLCanvasElement): ReactCADView;
  computeNodeAsync(node: ReactCADNode): Promise<void>;
  renderNodeAsync(node: ReactCADNode, view: ReactCADView): Promise<void>;
  renderSTL(
    node: ReactCADNode,
    linearDeflection: number,
    isRelative: boolean,
    angularDeflection: number
  ): Promise<string | ArrayBuffer | undefined>;
  renderBREP(node: ReactCADNode): Promise<string | ArrayBuffer | undefined>;
  renderSTEP(node: ReactCADNode): Promise<string | ArrayBuffer | undefined>;
  canvas: HTMLCanvasElement;
  canvases: Record<string, HTMLCanvasElement>;
  mainScriptUrlOrBlob?: string;
}

declare const reactCadCore: EmscriptenModuleFactory<ReactCADCore>;

export default reactCadCore;
