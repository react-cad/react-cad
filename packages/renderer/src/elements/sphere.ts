import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Sphere= "sphere";

function validateProps(props: ElementProps[Sphere]): boolean {
  if (props.radius <= 0) {
    throw new Error(`sphere: "radius" prop must be greater than 0`);
  }

  return true;
}

export function createInstance(
  type: Sphere,
  props: ElementProps[Sphere],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Sphere> {
  validateProps(props);
  return {
    type: "sphere",
    shape: rootContainerInstance.makeSphere(props.radius),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Sphere>) {
  instance.shape.delete();
}

export const hasChildren = false;

export function commitChildren() {}

export function prepareUpdate(
  instance: Instance<Sphere>,
  type: Sphere,
  oldProps: ElementProps[Sphere],
  newProps: ElementProps[Sphere],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  validateProps(newProps);

  if (oldProps.radius !== newProps.radius) {
    return { ...newProps, rootContainerInstance, hostContext };
  }

  return null;
}
export function commitUpdate(
  instance: Instance<Sphere>,
  updatePayload: UpdatePayload,
  type: Sphere,
  oldProps: ElementProps[Sphere],
  newProps: ElementProps[Sphere],
  internalInstanceHandle: InstanceHandle
) {
  const oldShape = instance.shape;
  instance.shape = instance.rootContainerInstance.makeSphere(newProps.radius),
  instance.notifyParent?.();
  oldShape.delete();
}
