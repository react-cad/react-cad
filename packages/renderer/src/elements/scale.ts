import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Scale = "scale";

function validateProps(props: ElementProps[Scale]): boolean {
  if (props.factor <= 0) {
    throw new Error(`scale: "factor" prop must be greater than 0`);
  }

  return true;
}

export function createInstance(
  _type: Scale,
  props: ElementProps[Scale],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Scale> {
  validateProps(props);
  const transform = rootContainerInstance.makeScale(props.factor);
  const initialChild = hostContext.nullShape();
  return {
    type: "scale",
    shape: rootContainerInstance.applyTransform(initialChild, transform),
    data: {
      transform,
    },
    children: [],
    childShape: initialChild,
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Scale>): void {
  instance.shape.delete();
  instance.data.transform.delete();
}

export const hasChildren = true;

export function commitChildren(parentInstance: Instance<Scale>): void {
  const oldShape = parentInstance.shape;
  if (parentInstance.childShape) {
    parentInstance.shape = parentInstance.rootContainerInstance.applyTransform(
      parentInstance.childShape,
      parentInstance.data.transform
    );
  } else {
    parentInstance.shape = parentInstance.hostContext.nullShape();
  }
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  _instance: Instance<Scale>,
  _type: Scale,
  oldProps: ElementProps[Scale],
  newProps: ElementProps[Scale],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  validateProps(newProps);
  if (oldProps.factor !== newProps.factor) {
    return { ...newProps, rootContainerInstance, hostContext };
  }
  return null;
}
export function commitUpdate(
  instance: Instance<Scale>,
  _updatePayload: UpdatePayload,
  _type: Scale,
  _oldProps: ElementProps[Scale],
  newProps: ElementProps[Scale],
  _internalInstanceHandle: InstanceHandle
): void {
  const oldTransform = instance.data.transform;

  instance.data.transform = instance.rootContainerInstance.makeScale(
    newProps.factor
  );

  commitChildren(instance);
  instance.notifyParent?.();

  oldTransform.delete();
}
