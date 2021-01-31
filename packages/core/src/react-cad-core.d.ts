export class EmClass {
  delete(): void;
}

export class ReactCADView extends EmClass {
  public addNode(node: ReactCADNode): void;
  public removeNode(node: ReactCADNode): void;
  public renderNodes(): void;
  public fit(): void;
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
  createCADNode(type: string): ReactCADNode;
  getView(): ReactCADView;
  cwrap: typeof cwrap;
  ccall: typeof ccall;
  canvas: HTMLCanvasElement;
}

declare const reactCadCore: EmscriptenModuleFactory<ReactCADCore>;

export default reactCadCore;
