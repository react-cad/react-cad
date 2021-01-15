import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
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
  _type: Torus,
  props: ElementProps[Torus],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Torus> {
  validateProps(props);
  return {
    type: "torus",
    shape: rootContainerInstance.makeTorus(props.radius1, props.radius2),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Torus>): void {
  instance.shape.delete();
}

export const hasChildren = false;

export function commitChildren(): void {}

export function prepareUpdate(
  _instance: Instance<Torus>,
  _type: Torus,
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
  _updatePayload: UpdatePayload,
  _type: Torus,
  _oldProps: ElementProps[Torus],
  newProps: ElementProps[Torus],
  _internalInstanceHandle: InstanceHandle
): void {
  const oldShape = instance.shape;
  (instance.shape = instance.rootContainerInstance.makeTorus(
    newProps.radius1,
    newProps.radius2
  )),
    instance.notifyParent?.();
  oldShape.delete();
}
