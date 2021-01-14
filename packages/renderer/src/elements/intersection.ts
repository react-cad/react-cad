import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Intersection = "intersection";

export function createInstance(
  _type: Intersection,
  _props: ElementProps[Intersection],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Intersection> {
  return {
    type: "intersection",
    shape: hostContext.nullShape(),
    data: undefined,
    children: [],
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Intersection>): void {
  instance.shape.delete();
}

export const hasChildren = true;

export const skipChildUnion = true;

export function commitChildren(parentInstance: Instance<Intersection>): void {
  const oldShape = parentInstance.shape;
  parentInstance.shape = parentInstance.rootContainerInstance.makeIntersection(
    parentInstance.children.map(({ shape }) => shape)
  );
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  _instance: Instance<Intersection>,
  _type: Intersection,
  _oldProps: ElementProps[Intersection],
  _newProps: ElementProps[Intersection],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  return null;
}
export function commitUpdate(
  _instance: Instance<Intersection>,
  _updatePayload: UpdatePayload,
  _type: Intersection,
  _oldProps: ElementProps[Intersection],
  _newProps: ElementProps[Intersection],
  _internalInstanceHandle: InstanceHandle
): void {}
