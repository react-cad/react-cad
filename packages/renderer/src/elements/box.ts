import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Box = "box";

export function validateProps(props: ElementProps[Box]): boolean {
  if (!props.x || props.x <= 0) {
    throw new Error(`box: "x" prop must be greater than 0`);
  }
  if (!props.y || props.y <= 0) {
    throw new Error(`box: "y" prop must be greater than 0`);
  }
  if (!props.z || props.z <= 0) {
    throw new Error(`box: "z" prop must be greater than 0`);
  }

  return true;
}

export function createInstance(
  _type: Box,
  props: ElementProps[Box],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Box> {
  validateProps(props);
  return {
    type: "box",
    shape: rootContainerInstance.makeBox(props.x, props.y, props.z),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Box>): void {
  instance.shape.delete();
}

export const hasChildren = false;

export function commitChildren(): void {}

export function prepareUpdate(
  _instance: Instance<Box>,
  _type: Box,
  oldProps: ElementProps[Box],
  newProps: ElementProps[Box],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  validateProps(newProps);

  if (
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z
  ) {
    return { ...newProps, rootContainerInstance, hostContext };
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Box>,
  _updatePayload: UpdatePayload,
  _type: Box,
  _oldProps: ElementProps[Box],
  newProps: ElementProps[Box],
  _internalInstanceHandle: InstanceHandle
): void {
  const oldShape = instance.shape;
  (instance.shape = instance.rootContainerInstance.makeBox(
    newProps.x,
    newProps.y,
    newProps.z
  )),
    instance.notifyParent?.();
  oldShape.delete();
}
