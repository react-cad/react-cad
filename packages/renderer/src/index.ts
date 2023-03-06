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

import { prepareUpdate, commitUpdate } from "./elements";

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
    const { rootNodes, root } = rootContainerInstance;
    rootNodes.forEach((node) => root.removeChild(node));
    rootContainerInstance.rootNodes = [];
  },
  getPublicInstance(instance: Instance) {
    return instance.node;
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
    const { rootNodes, root } = rootContainerInstance;
    root.appendChild(child.node);
    rootNodes.push(child.node);
  },
  insertInContainerBefore(
    rootContainerInstance: Container,
    child: Instance,
    before: Instance
  ) {
    const { rootNodes, root } = rootContainerInstance;
    root.insertChildBefore(child.node, before.node);
    rootNodes.push(child.node);
  },
  removeChildFromContainer(rootContainerInstance: Container, child: Instance) {
    const { root, rootNodes } = rootContainerInstance;
    const index = rootNodes.indexOf(child.node);
    if (index < 0) {
      throw new Error(`removeChildFromContainer child does not exist`);
    }
    rootNodes.splice(index, 1);
    root.removeChild(child.node);
  },
  insertBefore(parent, child, before) {
    if (typeof child !== "string" && typeof before !== "string") {
      parent.node.insertChildBefore(child.node, before.node);
    }
  },
  removeChild(parent: Instance, child: Instance) {
    parent.node.removeChild(child.node);
  },
  finalizeInitialChildren<T extends Type>(
    _instance: Instance<T>,
    _type: T,
    _props: ElementProps[T],
    _rootContainerInstance: Container,
    _hostContext: HostContext
  ): boolean {
    return false;
  },
  prepareForCommit(_containerInfo: Container) {
    return null;
  },
  resetAfterCommit(rootContainerInstance: Container) {
    const { rootNodes, nodes, callback } = rootContainerInstance;

    // Free memory of removed nodes
    const removedNodes = nodes.filter((node) => !node.hasParent());
    removedNodes.forEach((node) => node.delete());

    // Remove deleted nodes from list
    rootContainerInstance.nodes = rootContainerInstance.nodes.filter(
      (node) => !removedNodes.includes(node)
    );
    rootContainerInstance.rootNodes = rootNodes.filter(
      (node) => !removedNodes.includes(node)
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
    const { core, nodes } = rootContainerInstance;
    const node = core.createCADNode(type);
    nodes.push(node);
    const instance = {
      core,
      type,
      node,
    };
    commitUpdate(instance, props, type);
    return instance;
  },
  appendInitialChild(
    parentInstance: Instance,
    childInstance: Instance | TextInstance
  ): void {
    if (typeof childInstance !== "string") {
      parentInstance.node.appendChild(childInstance.node);
    }
  },
  appendChild(parentInstance: Instance, childInstance: Instance): void {
    if (typeof childInstance !== "string") {
      parentInstance.node.appendChild(childInstance.node);
    }
  },
  prepareUpdate,
  commitUpdate,
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
      nodes: [],
      rootNodes: [],
      root: rootNode,
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
    reconcilerInstance.updateContainer(element, this.container, null, () => {});
  }

  public delete() {
    this.context.nodes.forEach((node) => node.delete());
    this.isDeleted = true;
  }
}

export function createRoot(
  root: ReactCADNode,
  core: ReactCADCore
): ReactCADRoot {
  return new ReactCADRoot(root, core);
}

export * from "./types";
