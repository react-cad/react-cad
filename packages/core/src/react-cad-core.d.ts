export class EmClass {
  delete(): void;
  isDeleted(): boolean;
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
  public setQuality(deviationCoefficent: number, angle: number): void;
  public setViewpoint(viewpoint: Viewpoint): void;
  public resetView(): void;
  public fit(): void;
  public setProjection(projection: Projection): void;
  public showAxes(show: boolean): void;
  public showGrid(show: boolean): void;
  public showWireframe(show: boolean): void;
  public showShaded(show: boolean): void;
  public onResize(): void;
}

export class ProgressIndicator<T = void> extends Promise<T> {
  subscribe(fn: (progress: number, name?: string) => void): void;
  unsubscribe(fn: (progress: number, name?: string) => void): void;
  isFulfilled(): boolean;
  cancel(): void;
  delete(): void;
  isDeleted(): boolean;
}

export type Vector = [number, number, number];
export type Point = [number, number, number];
export type Quaternion = [number, number, number, number];
export type Polygon = Point[];
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

export class ReactCADSolidNode extends ReactCADNode {}

// Sweeps
export class ReactCADRevolutionNode extends ReactCADNode {
  public setAxisAngle(axis: Vector, angle: number): void;
}

export class ReactCADPrismNode extends ReactCADNode {
  public setVector(vector: Vector): void;
}

export class ReactCADEvolutionNode extends ReactCADNode {
  public setProfile(pathData: string): void;
}

export class ReactCADPipeNode extends ReactCADNode {
  public setSpine(pathData: string): void;
}

export class ReactCADHelixNode extends ReactCADNode {
  public setPitch(pitch: number): void;
  public setHeight(height: number): void;
  public setLeftHanded(leftHanded: boolean): void;
}

export class ReactCADLoftNode extends ReactCADNode {
  public setExact(exact: boolean): void;
  public setSmooth(smooth: boolean): void;
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

// Surfaces
export class ReactCADSVG extends EmClass {
  public setSource(svg: string): void;
}
export class ReactCADSurfaceNode extends ReactCADNode {
  public setOrigin(origin: Point): void;
  public appendSVG(child: ReactCADSVG): void;
  public insertSVGBefore(child: ReactCADSVG, before: ReactCADSVG): void;
  public removeSVG(child: ReactCADSVG): void;
  public updateSVGs(): void;
}
export class ReactCADPlaneNode extends ReactCADSurfaceNode {}
export class ReactCADSphericalSurfaceNode extends ReactCADSurfaceNode {
  public setRadius(radius: number): void;
}
export class ReactCADCylindricalSurfaceNode extends ReactCADSurfaceNode {
  public setRadius(radius: number): void;
}

export interface ReactCADNodeTypes {
  box: ReactCADBoxNode;
  cone: ReactCADConeNode;
  cylinder: ReactCADCylinderNode;
  polyhedron: ReactCADPolyhedronNode;
  solid: ReactCADSolidNode;
  sphere: ReactCADSphereNode;
  torus: ReactCADTorusNode;
  wedge: ReactCADWedgeNode;
  difference: ReactCADNode;
  intersection: ReactCADNode;
  union: ReactCADNode;
  helix: ReactCADHelixNode;
  pipe: ReactCADPipeNode;
  prism: ReactCADPrismNode;
  loft: ReactCADLoftNode;
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
  planar: ReactCADPlaneNode;
  spherical: ReactCADSphericalSurfaceNode;
  cylindrical: ReactCADCylindricalSurfaceNode;
}

export interface ReactCADCore extends EmscriptenModule {
  ReactCADNode: typeof ReactCADNode;
  ReactCADView: typeof ReactCADView;
  ReactCADSVG: typeof ReactCADSVG;
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
  PRECISION: number;
  ANGULAR_PRECISION: number;
  APPROXIMATION_PRECISION: number;
  createCADNode<T extends keyof ReactCADNodeTypes = "union">(
    type: T
  ): ReactCADNodeTypes[T];
  createSVG(): ReactCADSVG;
  createView(canvas: HTMLCanvasElement): ReactCADView;
  computeNodeAsync(node: ReactCADNode): ProgressIndicator;
  renderNodeAsync(node: ReactCADNode, view: ReactCADView): ProgressIndicator;
  setRenderQuality(
    view: ReactCADView,
    deviationCoefficent: number,
    angle: number
  ): ProgressIndicator;
  renderSTL(
    node: ReactCADNode,
    linearDeflection: number,
    angularDeflection: number
  ): ProgressIndicator<string | ArrayBuffer | undefined>;
  renderBREP(
    node: ReactCADNode
  ): ProgressIndicator<string | ArrayBuffer | undefined>;
  renderSTEP(
    node: ReactCADNode
  ): ProgressIndicator<string | ArrayBuffer | undefined>;
  canvas: HTMLCanvasElement;
  canvases: Record<string, HTMLCanvasElement>;
  mainScriptUrlOrBlob?: string;
  testProgress?: () => ProgressIndicator;
}

export class GeometryError extends Error {
  public route: string;
}

declare const reactCadCore: EmscriptenModuleFactory<ReactCADCore>;

export default reactCadCore;
