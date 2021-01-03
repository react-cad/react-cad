import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Union = "union";

export function createInstance(
  type: Union,
  props: ElementProps[Union],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Union> {
  return {
    type: "union",
    shape: hostContext.nullShape(),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Union>) {
  instance.shape.delete();
}

export const hasChildren = true;

export function commitChildren(
  parentInstance: Instance<Union>
) {
  const oldShape = parentInstance.shape;
  parentInstance.shape = parentInstance.childShape ?? parentInstance.hostContext.nullShape();
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  instance: Instance<Union>,
  type: Union,
  oldProps: ElementProps[Union],
  newProps: ElementProps[Union],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  return null;
}
export function commitUpdate(
  instance: Instance<Union>,
  updatePayload: UpdatePayload,
  type: Union,
  oldProps: ElementProps[Union],
  newProps: ElementProps[Union],
  internalInstanceHandle: InstanceHandle
) {
}
