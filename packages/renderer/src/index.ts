import React from "react";
import ReactReconciler from "react-reconciler";
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
} from "./types";

import { isReactCADType } from "./elements";
import { CADInstance, SVGInstance, SVGStringInstance } from "./instance";

export const HostConfig: ReactReconciler.HostConfig<
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
  number,
  undefined
> = {
  isPrimaryRenderer: true,
  supportsMutation: true,
  supportsPersistence: false,
  supportsHydration: false,
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  noTimeout: undefined,
  now: Date.now,
  // @ts-expect-error reconciler types don't include clearContainer but omitting causes a crash
  clearContainer(rootContainerInstance: Container) {
    const { rootInstances, root } = rootContainerInstance;
    rootInstances.forEach((instance) => root.removeChild(instance));
    rootContainerInstance.rootInstances = [];
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
    rootInstances.push(child);
  },
  insertInContainerBefore(
    rootContainerInstance: Container,
    child: Instance,
    before: Instance
  ) {
    const { root, rootInstances } = rootContainerInstance;
    root.insertBefore(child, before);
    rootInstances.push(child);
  },
  removeChildFromContainer(rootContainerInstance: Container, child: Instance) {
    const { root, rootInstances } = rootContainerInstance;
    const index = rootInstances.indexOf(child);
    if (index < 0) {
      throw new Error(`removeChildFromContainer child does not exist`);
    }
    rootInstances.splice(index, 1);
    root.removeChild(child);
  },
  insertBefore(parent, child, before) {
    if (typeof child === "string" || typeof before === "string") {
      return;
    }
    parent.insertBefore(child, before);
  },
  removeChild(parent: Instance, child: Instance) {
    parent.removeChild(child);
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
  prepareForCommit(containerInfo: Container) {
    const { instances } = containerInfo;
    instances.forEach(
      (instance) => instance instanceof SVGInstance && instance.commitSVG()
    );
    return null;
  },
  resetAfterCommit(rootContainerInstance: Container) {
    const { rootInstances, instances, callback } = rootContainerInstance;

    // Free memory of removed nodes
    const removedInstances = instances.filter(
      (instance) => !instance.hasParent()
    );
    removedInstances.forEach((instance) => instance.delete());

    // Remove deleted nodes from list
    rootContainerInstance.instances = instances.filter(
      (instance) => !removedInstances.includes(instance)
    );
    rootContainerInstance.rootInstances = rootInstances.filter(
      (instance) => !removedInstances.includes(instance)
    );

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
  shouldDeprioritizeSubtree(_type: Type, _props: Props) {
    return false;
  },
  createInstance<T extends Type>(
    type: T,
    props: Props<T>,
    rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: InstanceHandle
  ): Instance {
    const { core, instances } = rootContainerInstance;

    const instance: Instance = isReactCADType(type)
      ? new CADInstance(core, type)
      : type === "svgString"
      ? new SVGStringInstance(core, (props as Props<"svgString">).children)
      : new SVGInstance(core, type);

    instances.push(instance);
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
    _type: T,
    oldProps: Props<T>,
    newProps: Props<T>,
    rootContainerInstance: Container,
    hostContext: HostContext
  ): UpdatePayload | null {
    return instance.prepareUpdate(
      oldProps,
      newProps,
      rootContainerInstance,
      hostContext
    );
  },
  commitUpdate(instance: Instance, updatePayload: UpdatePayload): void {
    instance.commitUpdate(updatePayload);
  },
};

const reconcilerInstance = ReactReconciler(HostConfig);

class ReactCADRoot {
  private context: Container;
  private container: ReactReconciler.FiberRoot;
  private isDeleted: boolean;

  public constructor(rootNode: ReactCADNode, core: ReactCADCore) {
    const isAsync = false;
    const hydrate = false;

    this.context = {
      core,
      instances: [],
      rootInstances: [],
      root: new CADInstance(core, "union", rootNode),
    };

    this.container = reconcilerInstance.createContainer(
      this.context,
      isAsync,
      hydrate
    );

    this.isDeleted = false;
  }

  public render(element: React.ReactElement, callback = () => {}) {
    if (this.isDeleted) {
      throw Error("Cannot render a deleted root");
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
      null,
      () => {}
    );
  }

  public delete() {
    this.context.instances.forEach((instance) => instance.delete());
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
