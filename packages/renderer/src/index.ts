import React from "react";
import ReactReconciler from "react-reconciler";
import { ReactCadCoreModule } from "@react-cad/core";

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

import { prepareUpdate } from "./elements";

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
    const { core, rootNodes } = rootContainerInstance;
    rootNodes.forEach((node) => {
      core.getView().removeNode(node);
    });
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
    const { rootNodes, core } = rootContainerInstance;
    core.getView().addNode(child.node);
    rootNodes.push(child.node);
  },
  insertInContainerBefore(
    rootContainerInstance: Container,
    child: Instance,
    beforeChild: Instance
  ) {
    const { rootNodes, core } = rootContainerInstance;
    const index = rootNodes.indexOf(beforeChild.node);
    if (index < 0) {
      throw new Error(`insertInContainerBefore child does not exist`);
    }
    core.getView().addNode(child.node);
    rootNodes.splice(index, 0, child.node);
  },
  removeChildFromContainer(rootContainerInstance: Container, child: Instance) {
    const { core, rootNodes } = rootContainerInstance;
    const index = rootNodes.indexOf(child.node);
    if (index < 0) {
      throw new Error(`removeChildFromContainer child does not exist`);
    }
    rootNodes.splice(index, 1);
    core.getView().removeNode(child.node);
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
    // TODO: Implement?
  },
  resetAfterCommit(rootContainerInstance: Container) {
    const { core, rootNodes, nodes } = rootContainerInstance;
    // Update view
    core.getView().renderNodes();

    // Free memory of removed nodes
    const removedNodes = nodes.filter(
      (node) => !rootNodes.includes(node) && !node.hasParent()
    );
    removedNodes.forEach((node) => {
      node.delete();
    });
    // Remove deleted nodes from list
    rootContainerInstance.nodes = rootContainerInstance.nodes.filter(
      (node) => !removedNodes.includes(node)
    );
  },
  shouldSetTextContent(_type: Type, _props: Props) {
    return false;
  },
  createTextInstance(
    _text: string,
    _rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: InstanceHandle
  ): TextInstance {
    throw Error("Text not supported");
  },
  commitTextUpdate() {
    throw Error("Text not supported");
  },
  resetTextContent() {
    throw Error("Text not supported");
  },
  shouldDeprioritizeSubtree(_type: Type, _props: Props) {
    return false;
  },
  createInstance<T extends Type>(
    type: T,
    props: ElementProps[T],
    rootContainerInstance: Container,
    _hostContext: HostContext,
    _internalInstanceHandle: InstanceHandle
  ): Instance {
    const { core, nodes } = rootContainerInstance;
    const node = core.createCADNode(type);
    node.setProps(props);
    nodes.push(node);
    return {
      type,
      node,
    };
  },
  appendInitialChild(parentInstance: Instance, childInstance: Instance): void {
    parentInstance.node.appendChild(childInstance.node);
  },
  appendChild(parentInstance: Instance, childInstance: Instance): void {
    parentInstance.node.appendChild(childInstance.node);
  },
  prepareUpdate,
  commitUpdate<T extends Type>(
    instance: Instance<T>,
    _updatePayload: UpdatePayload,
    _type: T,
    _oldProps: ElementProps[T],
    newProps: ElementProps[T],
    _internalInstanceHandle: InstanceHandle
  ): void {
    instance.node.setProps(newProps);
  },
};

const reconcilerInstance = ReactReconciler(HostConfig);

interface Renderer {
  render(
    element: React.ReactElement,
    core: ReactCadCoreModule,
    callback?: () => void
  ): (element: React.ReactElement, callback?: () => void) => void;
}

const Renderer: Renderer = {
  render(element, core, callback = () => {}) {
    const isAsync = false;
    const hydrate = false;
    const container = reconcilerInstance.createContainer(
      {
        core,
        nodes: [],
        rootNodes: [],
      },
      isAsync,
      hydrate
    ); // Creates root fiber node.

    const parentComponent = null;

    reconcilerInstance.updateContainer(
      element,
      container,
      parentComponent,
      callback ?? (() => {})
    );

    return (element, callback = () => {}) =>
      reconcilerInstance.updateContainer(
        element,
        container,
        parentComponent,
        callback
      );
  },
};

export default Renderer;
