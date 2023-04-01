import React from "react";
import ReactReconciler from "react-reconciler";
import { LegacyRoot, DefaultEventPriority } from "react-reconciler/constants";
import { ReactCADCore, ReactCADNode } from "@react-cad/core";

import {
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  InstanceHandle,
  ElementProps,
  SuspenseInstance,
} from "./types";

import { isReactCADType } from "./elements";
import { CADInstance, SVGInstance, SVGStringInstance } from "./instance";

export const HostConfig: ReactReconciler.HostConfig<
  Type,
  Props,
  Container,
  Instance,
  TextInstance,
  SuspenseInstance,
  HydratableInstance,
  PublicInstance,
  HostContext,
  UpdatePayload,
  ChildSet,
  number,
  number
> = {
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  scheduleTimeout: setTimeout,
  cancelTimeout: clearTimeout,
  noTimeout: -1,
  supportsMicrotasks: true,
  scheduleMicrotask: queueMicrotask,
  isPrimaryRenderer: false,
  warnsIfNotActing: false,
  getCurrentEventPriority() {
    return DefaultEventPriority;
  },
  getInstanceFromNode(_node: any) {
    return undefined;
  },
  beforeActiveInstanceBlur() {},
  afterActiveInstanceBlur() {},
  prepareScopeUpdate(_scopeInstance: any, _instance: any) {},
  detachDeletedInstance(_node: Instance) {},
  getInstanceFromScope(_scopeInstance: any) {
    return null;
  },
  getPublicInstance(instance: Instance) {
    return instance.getPublicInstance();
  },
  getRootHostContext(_rootContainerInstance: Container) {
    const context: HostContext = {};
    return context;
  },
  getChildHostContext(
    parentHostContext: HostContext,
    _type: Type,
    _rootContainerInstance: Container
  ) {
    return parentHostContext;
  },
  appendChildToContainer(rootContainerInstance: Container, child: Instance) {
    const { rootInstances, root } = rootContainerInstance;
    root.appendChild(child);
    rootInstances.add(child);
  },
  insertInContainerBefore(
    rootContainerInstance: Container,
    child: Instance,
    before: Instance
  ) {
    const { root, rootInstances } = rootContainerInstance;
    root.insertBefore(child, before);
    rootInstances.add(child);
  },
  removeChildFromContainer(rootContainerInstance: Container, child: Instance) {
    const { root, rootInstances } = rootContainerInstance;
    if (!rootInstances.has(child)) {
      throw new Error(`removeChildFromContainer child does not exist`);
    }
    rootInstances.delete(child);
    root.removeChild(child);
    setTimeout(() => child.delete(), 0);
  },
  insertBefore(parent, child, before) {
    if (typeof child === "string" || typeof before === "string") {
      return;
    }
    parent.insertBefore(child, before);
  },
  removeChild(parent: Instance, child: Instance) {
    parent.removeChild(child);
    setTimeout(() => child.delete(), 0);
  },
  finalizeInitialChildren<T extends Type>(
    _instance: Instance,
    _type: T,
    _props: ElementProps[keyof ElementProps],
    _rootContainerInstance: Container,
    _hostContext: HostContext
  ): boolean {
    return false;
  },
  prepareForCommit(_containerInfo: Container) {
    return null;
  },
  resetAfterCommit(rootContainerInstance: Container) {
    const { updatedSVGs, callback } = rootContainerInstance;

    updatedSVGs.forEach((svg) => svg instanceof SVGInstance && svg.commitSVG());
    updatedSVGs.clear();

    callback?.();
  },
  shouldSetTextContent(_type: Type, _props: Props) {
    return false;
  },
  createTextInstance(
    text: string,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: InstanceHandle
  ): TextInstance {
    return text;
  },
  commitTextUpdate() {},
  resetTextContent() {},
  preparePortalMount(_containerInfo: Container) {},
  createInstance<T extends Type>(
    type: T,
    props: Props<T>,
    rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: InstanceHandle
  ): Instance {
    const { core, updatedSVGs } = rootContainerInstance;

    let instance: Instance;

    if (isReactCADType(type)) {
      instance = new CADInstance(core, type);
    } else if (type === "svgString") {
      instance = new SVGStringInstance(
        core,
        (props as Props<"svgString">).children
      );
      updatedSVGs.add(instance);
    } else {
      instance = new SVGInstance(core, type);
      updatedSVGs.add(instance);
    }

    instance.commitUpdate(props);

    return instance;
  },
  appendInitialChild(parent: Instance, child: Instance | TextInstance): void {
    if (typeof child === "string") {
      return;
    }
    parent.appendChild(child);
  },
  appendChild(parent: Instance, child: Instance): void {
    if (typeof child === "string") {
      return;
    }
    parent.appendChild(child);
  },
  prepareUpdate<T extends Type>(
    instance: Instance,
    type: T,
    oldProps: Props<T>,
    newProps: Props<T>,
    rootContainerInstance: Container,
    hostContext: HostContext
  ): UpdatePayload | null {
    const { updatedSVGs } = rootContainerInstance;
    const updatePayload = instance.prepareUpdate(
      oldProps,
      newProps,
      rootContainerInstance,
      hostContext
    );
    if (updatePayload && !isReactCADType(type)) {
      updatedSVGs.add(instance);
    }
    return updatePayload;
  },
  commitUpdate(instance: Instance, updatePayload: UpdatePayload): void {
    instance.commitUpdate(updatePayload);
  },
  clearContainer(rootContainerInstance: Container) {
    const { rootInstances } = rootContainerInstance;
    rootInstances.forEach((instance) =>
      // eslint-disable-next-line
      this.removeChildFromContainer!(rootContainerInstance, instance)
    );
    rootInstances.clear();
  },
};

const reconcilerInstance = ReactReconciler(HostConfig);
reconcilerInstance.injectIntoDevTools({
  rendererPackageName: "react-cad",
  version: "18.2.0",
  bundleType: process.env.NODE_ENV !== "production" ? 1 : 0,
});

class ReactCADRoot {
  private context: Container;
  private container: ReactReconciler.FiberRoot;
  private isDeleted: boolean;

  public constructor(rootNode: ReactCADNode, core: ReactCADCore) {
    this.context = {
      core,
      updatedSVGs: new Set(),
      rootInstances: new Set(),
      root: new CADInstance(core, "union", rootNode),
    };

    this.container = reconcilerInstance.createContainer(
      this.context,
      LegacyRoot,
      null,
      false,
      false,
      "",
      () => {},
      null
    );

    this.isDeleted = false;
  }

  public render(
    element: React.ReactElement,
    callback = () => {},
    parent: React.Component | null = null
  ) {
    if (this.isDeleted) {
      return;
      // throw Error("Cannot render a deleted root");
    }
    this.context.callback = callback;
    reconcilerInstance.updateContainer(
      React.createElement(
        PrecisionContext.Provider,
        {
          value: {
            precision: this.context.core.PRECISION,
            angularPrecision: this.context.core.ANGULAR_PRECISION,
            approximation: this.context.core.APPROXIMATION_PRECISION,
          },
        },
        element
      ),
      this.container,
      parent,
      () => {}
    );
  }

  public delete() {
    this.context.rootInstances.forEach((instance) => instance.delete());
    this.isDeleted = true;
  }
}

export function createRoot(
  root: ReactCADNode,
  core: ReactCADCore
): ReactCADRoot {
  return new ReactCADRoot(root, core);
}

export const PrecisionContext = React.createContext({
  precision: 1e-7,
  angularPrecision: 1e-12,
  approximation: 1e-6,
});

export * from "./types";
