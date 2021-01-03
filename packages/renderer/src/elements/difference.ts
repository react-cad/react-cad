import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Difference = "difference";

export function createInstance(
  type: Difference,
  props: ElementProps[Difference],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Difference> {
  return {
    type: "difference",
    shape: hostContext.nullShape(),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Difference>) {
  instance.shape.delete();
}

export const hasChildren = true;

export const skipChildUnion = true;

export function commitChildren(parentInstance: Instance<Difference>) {
  const oldShape = parentInstance.shape;
  parentInstance.shape = parentInstance.rootContainerInstance.makeDifference(
    parentInstance.children.map(({ shape }) => shape)
  );
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  instance: Instance<Difference>,
  type: Difference,
  oldProps: ElementProps[Difference],
  newProps: ElementProps[Difference],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  return null;
}
export function commitUpdate(
  instance: Instance<Difference>,
  updatePayload: UpdatePayload,
  type: Difference,
  oldProps: ElementProps[Difference],
  newProps: ElementProps[Difference],
  internalInstanceHandle: InstanceHandle
) {}
