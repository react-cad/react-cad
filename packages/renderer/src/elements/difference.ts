import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Difference = "difference";

export function createInstance(
  _type: Difference,
  _props: ElementProps[Difference],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Difference> {
  return {
    type: "difference",
    shape: hostContext.nullShape(),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Difference>): void {
  instance.shape.delete();
}

export const hasChildren = true;

export const skipChildUnion = true;

export function commitChildren(parentInstance: Instance<Difference>): void {
  const oldShape = parentInstance.shape;
  parentInstance.shape = parentInstance.rootContainerInstance.makeDifference(
    parentInstance.children.map(({ shape }) => shape)
  );
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  _instance: Instance<Difference>,
  _type: Difference,
  _oldProps: ElementProps[Difference],
  _newProps: ElementProps[Difference],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  return null;
}
export function commitUpdate(
  _instance: Instance<Difference>,
  _updatePayload: UpdatePayload,
  _type: Difference,
  _oldProps: ElementProps[Difference],
  _newProps: ElementProps[Difference],
  _internalInstanceHandle: InstanceHandle
): void {}
