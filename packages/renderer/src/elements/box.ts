import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Box = "box";

function validateProps(props: ElementProps[Box]): boolean {
  if (props.x <= 0) {
    throw new Error(`box: "x" prop must be greater than 0`);
  }
  if (props.y <= 0) {
    throw new Error(`box: "y" prop must be greater than 0`);
  }
  if (props.z <= 0) {
    throw new Error(`box: "z" prop must be greater than 0`);
  }

  return true;
}

export function createInstance(
  type: Box,
  props: ElementProps[Box],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Box> {
  validateProps(props);
  return {
    type: "box",
    shape: rootContainerInstance.makeBox(props.x, props.y, props.z),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Box>) {
  instance.shape.delete();
}

export const hasChildren = false;

export function commitChildren() {}

export function prepareUpdate(
  instance: Instance<Box>,
  type: Box,
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
  updatePayload: UpdatePayload,
  type: Box,
  oldProps: ElementProps[Box],
  newProps: ElementProps[Box],
  internalInstanceHandle: InstanceHandle
) {
  const oldShape = instance.shape;
  instance.shape = instance.rootContainerInstance.makeBox(newProps.x, newProps.y, newProps.z),
  instance.notifyParent?.();
  oldShape.delete();
}
