import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Union = "union";

export function createInstance(
  _type: Union,
  _props: ElementProps[Union],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Union> {
  return {
    type: "union",
    shape: hostContext.nullShape(),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Union>): void {
  instance.shape.delete();
}

export const hasChildren = true;

export function commitChildren(parentInstance: Instance<Union>): void {
  const oldShape = parentInstance.shape;
  parentInstance.shape =
    parentInstance.childShape ?? parentInstance.hostContext.nullShape();
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  _instance: Instance<Union>,
  _type: Union,
  _oldProps: ElementProps[Union],
  _newProps: ElementProps[Union],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  return null;
}
export function commitUpdate(
  _instance: Instance<Union>,
  _updatePayload: UpdatePayload,
  _type: Union,
  _oldProps: ElementProps[Union],
  _newProps: ElementProps[Union],
  _internalInstanceHandle: InstanceHandle
): void {}
