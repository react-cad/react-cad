import React from "react";
import ReactReconciler from "react-reconciler";
import { ReactCADCore } from "@react-cad/core";

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
    parent.node.insertChildBefore(child.node, before.node);
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
    const { root, rootNodes, nodes, core, reset } = rootContainerInstance;

    core.render(root, reset);
    rootContainerInstance.reset = false;

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
  appendInitialChild(parentInstance: Instance, childInstance: Instance): void {
    parentInstance.node.appendChild(childInstance.node);
  },
  appendChild(parentInstance: Instance, childInstance: Instance): void {
    parentInstance.node.appendChild(childInstance.node);
  },
  prepareUpdate,
  commitUpdate,
};

const reconcilerInstance = ReactReconciler(HostConfig);

interface RendererConfig {
  context: Container;
  container: ReactReconciler.FiberRoot;
}

const rendererConfigs: Map<ReactCADCore, RendererConfig> = new Map();

function createConfig(core: ReactCADCore): RendererConfig {
  const root = core.createCADNode("union");

  const isAsync = false;
  const hydrate = false;

  const context: Container = {
    core,
    nodes: [],
    rootNodes: [],
    root,
    reset: true,
  };

  const container = reconcilerInstance.createContainer(
    context,
    isAsync,
    hydrate
  );

  return { context, container };
}

export function render(
  element: React.ReactElement,
  core: ReactCADCore,
  reset = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    const existingContainer = rendererConfigs.get(core);
    const { container } =
      existingContainer ??
      rendererConfigs.set(core, createConfig(core)).get(core) ??
      {};

    if (container) {
      if (reset) {
        container.containerInfo.reset = true;
      }
      reconcilerInstance.updateContainer(element, container, null, () => {
        if (!existingContainer) {
          core.resetView();
        }
        resolve();
      });
      return;
    }

    reject("React container could not be created");
  });
}

export function destroyContainer(core: ReactCADCore): void {
  const config = rendererConfigs.get(core);
  if (!config) {
    return;
  }
  rendererConfigs.delete(core);
  config.context.nodes.forEach((node) => node.delete());
  config.context.root.delete();
}

export function renderToSTL(
  element: React.ReactElement,
  core: ReactCADCore,
  linearDeflection = 0.05,
  isRelative = false,
  angularDeflection = 0.5
): Promise<string> {
  const isAsync = false;
  const hydrate = false;

  const context: Container = {
    core,
    nodes: [],
    rootNodes: [],
    root: core.createCADNode("union"),
    reset: true,
  };

  const container = reconcilerInstance.createContainer(
    context,
    isAsync,
    hydrate
  ); // Creates root fiber node.

  const parentComponent = null;

  return new Promise((resolve, reject) => {
    reconcilerInstance.updateContainer(
      element,
      container,
      parentComponent,
      () => {
        try {
          const filename = "/tmp/shape.stl";
          const success = core.writeSTL(
            context.root,
            filename,
            linearDeflection,
            isRelative,
            angularDeflection
          );
          context.nodes.forEach((node) => node.delete());
          context.root.delete();
          if (success) {
            const content = core.FS.readFile(filename, { encoding: "utf8" });
            core.FS.unlink(filename);
            resolve(content);
          }
          core.FS.unlink(filename);
          reject("Could not create stl");
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}

export default {
  render,
  renderToSTL,
  destroyContainer,
};
