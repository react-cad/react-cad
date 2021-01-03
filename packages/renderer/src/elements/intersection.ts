import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload
} from "../types";

type Intersection = "intersection";

export function createInstance(
  type: Intersection,
  props: ElementProps[Intersection],
  rootContainerInstance: Container,
  hostContext: HostContext,
  internalInstanceHandle: InstanceHandle
): Instance<Intersection> {
  return {
    type: "intersection",
    shape: hostContext.nullShape(),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext
  };
}

export function destroyInstance(instance: Instance<Intersection>) {
  instance.shape.delete();
}

export const hasChildren = true;

export const skipChildUnion = true;

export function commitChildren(parentInstance: Instance<Intersection>) {
  const oldShape = parentInstance.shape;
  parentInstance.shape = parentInstance.rootContainerInstance.makeIntersection(
    parentInstance.children.map(({ shape }) => shape)
  );
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  instance: Instance<Intersection>,
  type: Intersection,
  oldProps: ElementProps[Intersection],
  newProps: ElementProps[Intersection],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  return null;
}
export function commitUpdate(
  instance: Instance<Intersection>,
  updatePayload: UpdatePayload,
  type: Intersection,
  oldProps: ElementProps[Intersection],
  newProps: ElementProps[Intersection],
  internalInstanceHandle: InstanceHandle
) {}
