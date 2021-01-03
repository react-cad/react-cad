import {
  Element,
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  Type,
  UpdatePayload
} from "../types";

import * as box from "./box";
import * as rotation from "./rotation";

const elements: Record<Type, Element> = {
  box,
  rotation
};

function getElement(type: Type): Element {
  const element = elements[type];
  if (!element) {
    throw Error(`Unknown component type: ${type}`);
  }
  return element;
}

export function createInstance<T extends Type>(
  type: T,
  props: ElementProps[T],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance {
  const element = getElement(type);
  return element.createInstance(
    type,
    props,
    rootContainerInstance,
    hostContext,
    internalInstanceHandle
  );
}

function updateChildren(parentInstance: Instance) {
  const element = getElement(parentInstance.type);

  const oldChildShape = parentInstance.childShape;
  parentInstance.childShape = parentInstance.rootContainerInstance.makeUnion(
    parentInstance.children.map(({ shape }) => shape)
  );
  element.commitChildren(parentInstance);
  oldChildShape?.delete();
  return;
}

export function appendInitialChild<ParentType extends Type>(
  parentInstance: Instance<ParentType>,
  childInstance: Instance
) {
  parentInstance.children.push(childInstance);
  childInstance.notifyParent = () => updateChildren(parentInstance);
}

export function appendChild<ParentType extends Type>(
  parentInstance: Instance<ParentType>,
  childInstance: Instance
) {
  appendInitialChild(parentInstance, childInstance);
  updateChildren(parentInstance);
}

export function insertBefore<ParentType extends Type>(
  parentInstance: Instance<ParentType>,
  childInstance: Instance,
  beforeChild: Instance
) {
  const index = parentInstance.children.indexOf(beforeChild);
  if (index < 0) {
    throw new Error(`insertBefore child does not exist`);
  }
  parentInstance.children.splice(index, 0, childInstance);
  childInstance.notifyParent = () => updateChildren(parentInstance);
  updateChildren(parentInstance);
}

export function destroyInstance(instance: Instance) {
  const element = getElement(instance.type);
  element.destroyInstance(instance);
}

export function removeChild(parentInstance: Instance, childInstance: Instance) {
  const index = parentInstance.children.indexOf(childInstance);
  if (index < 0) {
    throw new Error(`removeChild child does not exist`);
  }
  parentInstance.children.splice(index, 1);
  updateChildren(parentInstance);
  destroyInstance(childInstance);
}

export function finalizeInitialChildren<ParentType extends Type>(
  parentInstance: Instance<ParentType>,
  type: ParentType,
  props: ElementProps[ParentType],
  rootContainerInstance: Container,
  hostContext: HostContext
) {
  updateChildren(parentInstance);
  return false;
}

export function prepareUpdate<T extends Type>(
  instance: Instance<T>,
  type: T,
  oldProps: ElementProps[T],
  newProps: ElementProps[T],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  const element = elements[type];
  if (element) {
    return element.prepareUpdate(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
      hostContext
    );
  }

  return null;
}

export function commitUpdate<T extends Type>(
  instance: Instance<T>,
  updatePayload: UpdatePayload,
  type: T,
  oldProps: ElementProps[T],
  newProps: ElementProps[T],
  internalInstanceHandle: InstanceHandle
) {
  const element = elements[type];
  if (element) {
    return element.commitUpdate(
      instance,
      updatePayload,
      type,
      oldProps,
      newProps,
      internalInstanceHandle
    );
  }
}
