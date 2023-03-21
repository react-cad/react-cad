import { ReactCADCore, ReactCADNodeTypes, ReactCADSVG } from "@react-cad/core";
import {
  ReactCADNodeType,
  Props,
  Type,
  Container,
  HostContext,
  UpdatePayload,
  SurfaceType,
  Instance,
} from "types";
import { prepareUpdate, commitUpdate } from "./elements";

export class CADInstance<T extends ReactCADNodeType = ReactCADNodeType>
  implements Instance {
  public readonly node: ReactCADNodeTypes[T];
  public readonly type: ReactCADNodeType;
  private readonly core: ReactCADCore;

  constructor(core: ReactCADCore, type: T, node?: ReactCADNodeTypes[T]) {
    this.node = node ?? core.createCADNode(type);
    this.core = core;
    this.type = type;
  }

  getPublicInstance(): ReactCADNodeTypes[T] {
    return this.node;
  }

  isType<U extends ReactCADNodeType>(type: U): this is CADInstance<U> {
    return this.type === type;
  }

  isSurface(): this is CADInstance<SurfaceType> {
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

  appendChild(child: Instance): void {
    if (this.isSurface()) {
      if (child instanceof SVGInstance && child.node.tagName === "svg") {
        child.parent = this;
        this.node.appendSVG(child.svg);
      } else {
        throw new Error("Surfaces cannot have non-svg children");
      }
    } else {
      if (child instanceof CADInstance) {
        this.node.appendChild(child.node);
      } else {
        throw new Error("Only surfaces can have SVG children");
      }
    }
  }
  insertBefore(child: Instance, before: Instance): void {
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
      if (child instanceof CADInstance && before instanceof CADInstance) {
        this.node.insertChildBefore(child.node, before.node);
      } else {
        throw new Error("Only surfaces can have SVG children");
      }
    }
  }
  removeChild(child: Instance): void {
    if (this.isSurface()) {
      if (child instanceof SVGInstance) {
        child.parent = undefined;
        this.node.removeSVG(child.svg);
      }
    } else {
      if (child instanceof CADInstance) {
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
> implements Instance {
  public node: SVGElement;
  public parent: CADInstance<SurfaceType> | SVGInstance | undefined;
  private readonly core: ReactCADCore;
  private children: SVGInstance[] = [];
  private svgNode: ReactCADSVG | undefined;
  private isChanged = true;

  constructor(core: ReactCADCore, node: T | SVGElement) {
    this.core = core;
    if (node instanceof Node) {
      this.node = node;
    } else {
      this.node = document.createElementNS("http://www.w3.org/2000/svg", node);
    }
  }

  getPublicInstance(): SVGElement {
    return this.node;
  }

  hasParent(): boolean {
    return this.parent !== undefined;
  }

  delete(): void {
    this.svgNode?.delete();
    this.children = [];
    this.parent = undefined;
  }

  appendChild(child: Instance): void {
    if (child instanceof SVGInstance) {
      child.parent = this;
      this.children.push(child);
      this.node.appendChild(child.node);
    } else {
      throw new Error("SVG cannot have CAD node children");
    }
  }
  insertBefore(child: Instance, before: Instance): void {
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
  removeChild(child: Instance): void {
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
    if (this.parent instanceof CADInstance && this.isChanged) {
      this.svg.setSource(this.node.outerHTML);
      this.isChanged = false;
    }
  }
}

export class SVGStringInstance extends SVGInstance {
  constructor(core: ReactCADCore, text: string) {
    const div = document.createElement("div");
    div.innerHTML = text.trim() || "<svg></svg>";
    const child = div.firstChild as SVGElement | null;
    if (child) {
      div.removeChild(child);
      super(core, child);
    } else {
      throw new Error(`Could not create SVG element from string:\n\n${text}`);
    }
  }

  commitUpdate(updatePayload: UpdatePayload): void {
    const text =
      (updatePayload as Props<"svgString">).children.trim() || "<svg></svg>";
    const div = document.createElement("div");
    div.innerHTML = text;
    const child = div.firstChild as SVGElement | null;
    if (child) {
      div.removeChild(child);
      if (this.parent instanceof SVGInstance) {
        this.parent.node.insertBefore(child, this.node);
        this.parent.node.removeChild(this.node);
      }
      this.node = child;
    } else {
      throw new Error(`Could not create SVG element from string:\n\n${text}`);
    }
    this.changed();
  }
}
