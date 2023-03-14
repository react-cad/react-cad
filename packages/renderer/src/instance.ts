import { ReactCADCore, ReactCADNodeTypes, ReactCADSVG } from "@react-cad/core";
import {
  ReactCADNodeType,
  Props,
  Type,
  Container,
  HostContext,
  UpdatePayload,
  SurfaceType,
} from "types";
import { prepareUpdate, commitUpdate } from "./elements";

export class ReactCADInstance<T extends ReactCADNodeType = ReactCADNodeType> {
  public readonly node: ReactCADNodeTypes[T];
  public readonly type: ReactCADNodeType;
  private readonly core: ReactCADCore;

  constructor(core: ReactCADCore, type: T, node?: ReactCADNodeTypes[T]) {
    this.node = node ?? core.createCADNode(type);
    this.core = core;
    this.type = type;
  }

  isType<U extends ReactCADNodeType>(type: U): this is ReactCADInstance<U> {
    return this.type === type;
  }

  isSurface(): this is ReactCADInstance<SurfaceType> {
    return ["plane", "sphericalSurface", "cylindricalSurface"].includes(
      this.type
    );
  }

  hasParent(): boolean {
    return this.node.hasParent();
  }

  delete(): void {
    this.node.delete();
  }

  appendChild(child: ReactCADInstance | SVGInstance): void {
    if (this.isSurface()) {
      if (child instanceof SVGInstance && child.node.tagName === "svg") {
        child.parent = this;
        this.node.appendSVG(child.svg);
      } else {
        throw new Error("Surfaces cannot have non-svg children");
      }
    } else {
      if (child instanceof ReactCADInstance) {
        this.node.appendChild(child.node);
      } else {
        throw new Error("Only surfaces can have SVG children");
      }
    }
  }
  insertBefore(
    child: ReactCADInstance | SVGInstance,
    before: ReactCADInstance | SVGInstance
  ): void {
    if (this.isSurface()) {
      if (
        child instanceof SVGInstance &&
        before instanceof SVGInstance &&
        child.node.tagName === "svg"
      ) {
        child.parent = this;
        this.node.insertSVGBefore(child.svg, before.svg);
      } else {
        throw new Error("Surfaces cannot have non-svg children");
      }
    } else {
      if (
        child instanceof ReactCADInstance &&
        before instanceof ReactCADInstance
      ) {
        this.node.insertChildBefore(child.node, before.node);
      } else {
        throw new Error("Only surfaces can have SVG children");
      }
    }
  }
  removeChild(child: ReactCADInstance | SVGInstance): void {
    if (this.isSurface()) {
      if (child instanceof SVGInstance) {
        child.parent = undefined;
        this.node.removeSVG(child.svg);
      }
    } else {
      if (child instanceof ReactCADInstance) {
        this.node.removeChild(child.node);
      }
    }
  }
  prepareUpdate(
    oldProps: Props<Type>,
    newProps: Props<Type>,
    rootContainerInstance: Container,
    hostContext: HostContext
  ): UpdatePayload | null {
    return prepareUpdate(
      this,
      this.type,
      oldProps,
      newProps,
      rootContainerInstance,
      hostContext
    );
  }
  commitUpdate(updatePayload: UpdatePayload): void {
    return commitUpdate(this, updatePayload, this.type);
  }
}

export class SVGInstance<
  T extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements
> {
  public node: SVGElement;
  public readonly type: keyof JSX.IntrinsicElements;
  public parent: ReactCADInstance<SurfaceType> | SVGInstance | undefined;
  private readonly core: ReactCADCore;
  private children: SVGInstance[] = [];
  private svgNode: ReactCADSVG | undefined;
  private isChanged = true;

  constructor(core: ReactCADCore, type: T) {
    this.core = core;
    this.node = document.createElementNS("http://www.w3.org/2000/svg", type);
    this.type = type;
  }

  hasParent(): boolean {
    return this.parent !== undefined;
  }

  delete(): void {
    this.svgNode?.delete();
    this.children = [];
    this.parent = undefined;
  }

  appendChild(child: ReactCADInstance | SVGInstance): void {
    if (child instanceof SVGInstance) {
      child.parent = this;
      this.children.push(child);
      this.node.appendChild(child.node);
    } else {
      throw new Error("SVG cannot have CAD node children");
    }
  }
  insertBefore(
    child: ReactCADInstance | SVGInstance,
    before: ReactCADInstance | SVGInstance
  ): void {
    if (child instanceof SVGInstance && before instanceof SVGInstance) {
      const index = this.children.indexOf(before);
      if (index >= 0) {
        child.parent = this;
        this.children.splice(index, 0, child);
        this.node.insertBefore(child.node, before.node);
      }
    } else {
      throw new Error("SVG cannot have CAD node children");
    }
  }
  removeChild(child: ReactCADInstance | SVGInstance): void {
    if (child instanceof SVGInstance) {
      const index = this.children.indexOf(child);
      if (index >= 0) {
        child.parent = undefined;
        this.children.splice(index, 1);
        this.node.removeChild(child.node);
      }
    }
  }
  changed(): void {
    if (!this.isChanged) {
      this.isChanged = true;
      if (this.parent instanceof SVGInstance) {
        this.parent.changed();
      }
    }
  }
  prepareUpdate(
    _oldProps: Props<Type>,
    newProps: Props<Type>,
    _rootContainerInstance: Container,
    _hostContext: HostContext
  ): UpdatePayload | null {
    return newProps;
  }
  commitUpdate(updatePayload: UpdatePayload): void {
    const entries = Object.entries(updatePayload);
    for (let i = 0; i < entries.length; i++) {
      const [propKey, propValue] = entries[i];
      if (propKey !== "children") {
        this.node.setAttribute(propKey, propValue);
        this.changed();
      }
    }
  }
  get svg(): ReactCADSVG {
    this.svgNode = this.svgNode ?? this.core.createSVG();
    return this.svgNode;
  }
  commitSVG(): void {
    if (this.parent instanceof ReactCADInstance && this.isChanged) {
      this.svg.setSource(this.node.outerHTML);
      this.isChanged = false;
    }
  }
}
