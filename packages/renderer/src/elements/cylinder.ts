import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Cylinder = "cylinder";

function validateProps(props: ElementProps[Cylinder]): boolean {
  if (props.radius <= 0) {
    throw new Error(`cylinder: "radius" prop must be greater than 0`);
  }
  if (props.height <= 0) {
    throw new Error(`cylinder: "height" prop must be greater than 0`);
  }

  return true;
}

export function createInstance(
  type: Cylinder,
  props: ElementProps[Cylinder],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Cylinder> {
  validateProps(props);
  return {
    type: "cylinder",
    shape: rootContainerInstance.makeCylinder(props.radius, props.height),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Cylinder>) {
  instance.shape.delete();
}

export const hasChildren = false;

export function commitChildren() {}

export function prepareUpdate(
  instance: Instance<Cylinder>,
  type: Cylinder,
  oldProps: ElementProps[Cylinder],
  newProps: ElementProps[Cylinder],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  validateProps(newProps);

  if (
    oldProps.radius !== newProps.radius ||
    oldProps.height !== newProps.height
  ) {
    return { ...newProps, rootContainerInstance, hostContext };
  }

  return null;
}
export function commitUpdate(
  instance: Instance<Cylinder>,
  updatePayload: UpdatePayload,
  type: Cylinder,
  oldProps: ElementProps[Cylinder],
  newProps: ElementProps[Cylinder],
  internalInstanceHandle: InstanceHandle
) {
  const oldShape = instance.shape;
  instance.shape = instance.rootContainerInstance.makeCylinder(newProps.radius, newProps.height),
  instance.notifyParent?.();
  oldShape.delete();
}
