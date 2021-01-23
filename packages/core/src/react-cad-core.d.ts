export class EmClass {
  delete(): void;
}

export class ReactCADNode extends EmClass {
  public setProps(props: unknown): void;
  public appendChild(child: ReactCADNode): void;
  public insertChildBefore(child: ReactCADNode, before: ReactCADNode): void;
  public removeChild(child: ReactCADNode): void;
  public hasParent(): boolean;
  public render(): void;
}

export class ReactCADView extends EmClass {
  public addNode(node: ReactCADNode): void;
  public removeNode(node: ReactCADNode): void;
  public renderNodes(): void;
  public fit(): void;
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
