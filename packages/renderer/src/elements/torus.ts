import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Torus = "torus";

function validateProps(props: ElementProps[Torus]): boolean {
  if (!props.radius1 || props.radius1 <= 0) {
    throw new Error(`torus: "radius1" prop must be greater than 0`);
  }
  if (!props.radius2 || props.radius2 <= 0) {
    throw new Error(`torus: "radius2" prop must be greater than 0`);
  }

  return true;
}

export function createInstance(
  type: Torus,
  props: ElementProps[Torus],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Torus> {
  validateProps(props);
  return {
    type: "torus",
    shape: rootContainerInstance.makeTorus(props.radius1, props.radius2),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Torus>) {
  instance.shape.delete();
}

export const hasChildren = false;

export function commitChildren() {}

export function prepareUpdate(
  instance: Instance<Torus>,
  type: Torus,
  oldProps: ElementProps[Torus],
  newProps: ElementProps[Torus],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  validateProps(newProps);

  if (
    oldProps.radius1 !== newProps.radius2 ||
    oldProps.radius2 !== newProps.radius2
  ) {
    return { ...newProps, rootContainerInstance, hostContext };
  }

  return null;
}
export function commitUpdate(
  instance: Instance<Torus>,
  updatePayload: UpdatePayload,
  type: Torus,
  oldProps: ElementProps[Torus],
  newProps: ElementProps[Torus],
  internalInstanceHandle: InstanceHandle
) {
  const oldShape = instance.shape;
  (instance.shape = instance.rootContainerInstance.makeTorus(
    newProps.radius1,
    newProps.radius2
  )),
    instance.notifyParent?.();
  oldShape.delete();
}
