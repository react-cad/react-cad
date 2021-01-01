import React from "react";
import ReactReconciler, { Fiber } from "react-reconciler";
import { ReactCadCoreModule, Shape } from "@react-cad/core";
import { ReactCad } from "../types/jsx";

export type Container = ReactCadCoreModule;
export type HostContext = any;
export type Type = "box";
export interface Props {}
export type Instance = Shape;
export type TextInstance = never;
export type HydratableInstance = never;
export type PublicInstance = Instance;
export type UpdatePayload = any;
export type ChildSet = never;

function createInstance<T extends keyof ReactCad.Props>(
  type: T,
  props: ReactCad.Props[T],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: Fiber
): Instance {
  switch (type) {
    case "box":
      return rootContainerInstance.makeBox(props.x, props.y, props.z);
    default:
      throw Error(`Unknown component type: ${type}`);
  }
}

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
  // @ts-ignore
  clearContainer(rootContainerInstance: Container) {
    console.log(rootContainerInstance);
    rootContainerInstance.clearShape();
  },
  getPublicInstance(instance: Instance) {
    return instance;
  },
  getRootHostContext(rootContainerInstance: Container) {
    const context: HostContext = {};
    return context;
  },
  getChildHostContext(
    parentHostContext: HostContext,
    type: Type,
    rootContainerInstance: Container
  ) {
    const context: HostContext = {
      ...parentHostContext
    };
    return context;
  },
  appendChildToContainer(rootContainerInstance: Container, child: Instance) {
    rootContainerInstance.setShape(child);
  },
  prepareForCommit(containerInfo: Container) {},
  resetAfterCommit(containerInfo: Container) {},
  createInstance,
  shouldSetTextContent(type: Type, props: Props) {
    return false;
  },
  createTextInstance(
    text: string,
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: Fiber
  ) {
    throw Error("TextInstance not implemented");
  },
  appendInitialChild(parentInstance: Instance, child: Instance) {},
  finalizeInitialChildren(
    parentInstance: Instance,
    type: Type,
    props: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
  ) {
    return false;
  },
  shouldDeprioritizeSubtree(type: Type, props: Props) {
    return false;
  },
  scheduleDeferredCallback(
    callback: () => any,
    options?: { timeout: number }
  ) {},
  cancelDeferredCallback(callbackID: any) {},
  prepareUpdate(
    instance: Instance,
    type: Type,
    oldProps: Props,
    newProps: Props,
    rootContainerInstance: Container,
    hostContext: HostContext
  ) {
    return null;
  }
};

const reconcilerInstance = ReactReconciler(HostConfig);

const Renderer = {
  render(
    element: React.ReactElement,
    root: Container,
    callback: () => void
  ) {
    const isAsync = false;
    const hydrate = false;
    const container = reconcilerInstance.createContainer(
      root,
      isAsync,
      hydrate
    ); // Creates root fiber node.

    const parentComponent = null;

    reconcilerInstance.updateContainer(
      element,
      container,
      parentComponent,
      callback
    );
  }
};

export default Renderer;
