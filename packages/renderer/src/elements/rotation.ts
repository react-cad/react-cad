import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Rotation = "rotation";

const AXES = ["x", "y", "z"];

function validateProps(props: ElementProps[Rotation]): boolean {
  if (!AXES.includes(props.axis)) {
    throw new Error(`rotation: unknown axis "${props.axis}"`);
  }
  if (typeof props.angle !== "number") {
    throw new Error(`rotation: expected numeric angle, got "${props.angle}"`);
  }
  return true;
}

function getAxis(dimension: "x" | "y" | "z", rootContainerInstance: Container) {
  switch (dimension) {
    case "x":
      return rootContainerInstance.Space.OX();
    case "y":
      return rootContainerInstance.Space.OY();
    case "z":
      return rootContainerInstance.Space.OZ();
    default:
      throw new Error(`rotation: unknown axis "${dimension}"`);
  }
}

export function createInstance(
  _type: Rotation,
  props: ElementProps[Rotation],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Rotation> {
  validateProps(props);
  const axis = getAxis(props.axis, rootContainerInstance);
  const transform = rootContainerInstance.makeRotation(axis, props.angle);
  const initialChild = hostContext.nullShape();
  axis.delete();
  return {
    type: "rotation",
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

export function destroyInstance(instance: Instance<Rotation>): void {
  instance.shape.delete();
  instance.data.transform.delete();
}

export const hasChildren = true;

export function commitChildren(parentInstance: Instance<Rotation>): void {
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
  _instance: Instance<Rotation>,
  _type: Rotation,
  oldProps: ElementProps[Rotation],
  newProps: ElementProps[Rotation],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  validateProps(newProps);
  if (oldProps.axis !== newProps.axis || oldProps.angle !== newProps.angle) {
    return { ...newProps, rootContainerInstance, hostContext };
  }
  return null;
}
export function commitUpdate(
  instance: Instance<Rotation>,
  _updatePayload: UpdatePayload,
  _type: Rotation,
  _oldProps: ElementProps[Rotation],
  newProps: ElementProps[Rotation],
  _internalInstanceHandle: InstanceHandle
): void {
  const oldTransform = instance.data.transform;
  const axis = getAxis(newProps.axis, instance.rootContainerInstance);

  instance.data.transform = instance.rootContainerInstance.makeRotation(
    axis,
    newProps.angle
  );

  commitChildren(instance);
  instance.notifyParent?.();

  axis.delete();
  oldTransform.delete();
}
