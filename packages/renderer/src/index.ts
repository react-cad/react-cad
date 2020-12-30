import React from "react";
import ReactReconciler, { Fiber } from "react-reconciler";

type CascadeShape = any;
type CascadePresenter = any;

namespace CascadeRenderer {
  export type Container = CascadePresenter;
  export type HostContext = any;
  export type Type = "box";
  export interface Props {}
  export type Instance = CascadeShape;
  export type TextInstance = never;
  export type HydratableInstance = never;
  export type PublicInstance = Instance;
  export type UpdatePayload = any;
  export type ChildSet = never;

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
    supportsMutation: false,
    supportsPersistence: false,
    supportsHydration: false,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    noTimeout: undefined,
    now: Date.now,
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
    prepareForCommit(containerInfo: Container) {},
    resetAfterCommit(containerInfo: Container) {},
    createInstance(
      type: Type,
      props: Props,
      rootContainerInstance: Container,
      hostContext: HostContext,
      internalInstanceHandle: Fiber
    ) {
      return {};
    },
    shouldSetTextContent(type: Type, props: Props) {
      return true;
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
    prepareUpdate(
      instance: Instance,
      type: Type,
      oldProps: Props,
      newProps: Props,
      rootContainerInstance: Container,
      hostContext: HostContext
    ) {
      return null;
    },
    shouldDeprioritizeSubtree(type: Type, props: Props) {
      return false;
    },
    scheduleDeferredCallback(
      callback: () => any,
      options?: { timeout: number }
    ) {},
    cancelDeferredCallback(callbackID: any) {}
  };
}

const reconcilerInstance = ReactReconciler(CascadeRenderer.HostConfig);

const Renderer = {
  render(
    element: React.ReactElement,
    root: CascadeRenderer.Container,
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
