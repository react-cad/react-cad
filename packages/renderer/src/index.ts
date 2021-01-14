import React from "react";
import ReactReconciler from "react-reconciler";
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
} from "./types";

import {
  createInstance,
  appendInitialChild,
  finalizeInitialChildren,
  appendChild,
  prepareUpdate,
  commitUpdate,
  destroyInstance,
} from "./elements";

function updateContainer(
  rootContainerInstance: Container,
  hostContext: HostContext
) {
  const oldChildShape = rootContainerInstance.childShape;
  if (rootContainerInstance.children) {
    rootContainerInstance.childShape = rootContainerInstance.makeUnion(
      rootContainerInstance.children.map(({ shape }) => shape)
    );
  } else {
    rootContainerInstance.childShape = hostContext.nullShape();
  }
  rootContainerInstance.setShape(rootContainerInstance.childShape);
  oldChildShape?.delete();
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
  // @ts-expect-error reconciler types don't include clearContainer but omitting causes a crash
  clearContainer(rootContainerInstance: Container) {
    rootContainerInstance.clearShape();
  },
  getPublicInstance(instance: Instance) {
    return instance.shape;
  },
  getRootHostContext(rootContainerInstance: Container) {
    const context: HostContext = {
      nullShape: () => new rootContainerInstance.Shape(),
    };
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
    rootContainerInstance.children = rootContainerInstance.children ?? [];
    rootContainerInstance.children.push(child);
    child.notifyParent = () => {
      updateContainer(rootContainerInstance, child.hostContext);
    };
    updateContainer(rootContainerInstance, child.hostContext);
  },
  insertInContainerBefore(
    rootContainerInstance: Container,
    child: Instance,
    beforeChild: Instance
  ) {
    rootContainerInstance.children = rootContainerInstance.children ?? [];
    const index = rootContainerInstance.children.indexOf(beforeChild);
    if (index < 0) {
      throw new Error(`insertInContainerBefore child does not exist`);
    }
    rootContainerInstance.children.splice(index, 0, child);
    child.notifyParent = () =>
      updateContainer(rootContainerInstance, child.hostContext);
    updateContainer(rootContainerInstance, child.hostContext);
  },
  removeChildFromContainer(rootContainerInstance: Container, child: Instance) {
    rootContainerInstance.children = rootContainerInstance.children ?? [];
    const index = rootContainerInstance.children.indexOf(child);
    if (index < 0) {
      throw new Error(`removeChildFromContainer child does not exist`);
    }
    rootContainerInstance.children.splice(index, 1);
    updateContainer(rootContainerInstance, child.hostContext);
    destroyInstance(child);
  },
  prepareForCommit(_containerInfo: Container) {
    // TODO: Implement?
  },
  resetAfterCommit(_containerInfo: Container) {
    // TODO: Implement?
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
  createInstance,
  appendInitialChild,
  finalizeInitialChildren,
  prepareUpdate,
  commitUpdate,
  appendChild,
};

const reconcilerInstance = ReactReconciler(HostConfig);

interface Renderer {
  render(
    element: React.ReactElement,
    root: Container,
    callback?: () => void
  ): (element: React.ReactElement, callback?: () => void) => void;
}

const Renderer: Renderer = {
  render(element, root, callback = () => {}) {
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
