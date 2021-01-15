import {
  ElementProps,
  Container,
  HostContext,
  InstanceHandle,
  Instance,
  UpdatePayload,
} from "../types";

type Translation = "translation";

export function createInstance(
  _type: Translation,
  props: ElementProps[Translation],
  rootContainerInstance: Container,
  hostContext: HostContext,
  _internalInstanceHandle: InstanceHandle
): Instance<Translation> {
  const transform = rootContainerInstance.makeTranslation(
    props.x,
    props.y,
    props.z
  );
  const initialChild = hostContext.nullShape();
  return {
    type: "translation",
    shape: rootContainerInstance.applyTransform(initialChild, transform),
    data: {
      transform,
    },
    children: [],
    childShape: initialChild,
    rootContainerInstance,
    hostContext,
  };
}

export function destroyInstance(instance: Instance<Translation>): void {
  instance.shape.delete();
  instance.data.transform.delete();
}

export const hasChildren = true;

export function commitChildren(parentInstance: Instance<Translation>): void {
  const oldShape = parentInstance.shape;
  if (parentInstance.childShape) {
    parentInstance.shape = parentInstance.rootContainerInstance.applyTransform(
      parentInstance.childShape,
      parentInstance.data.transform
    );
  } else {
    parentInstance.shape = parentInstance.hostContext.nullShape();
  }
  parentInstance.notifyParent?.();
  oldShape.delete();
}

export function prepareUpdate(
  _instance: Instance<Translation>,
  _type: Translation,
  oldProps: ElementProps[Translation],
  newProps: ElementProps[Translation],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  if (
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z
  ) {
    return { ...newProps, rootContainerInstance, hostContext };
  }
  return null;
}
export function commitUpdate(
  instance: Instance<Translation>,
  _updatePayload: UpdatePayload,
  _type: Translation,
  _oldProps: ElementProps[Translation],
  newProps: ElementProps[Translation],
  _internalInstanceHandle: InstanceHandle
): void {
  const oldTransform = instance.data.transform;

  instance.data.transform = instance.rootContainerInstance.makeTranslation(
    newProps.x,
    newProps.y,
    newProps.z
  );

  commitChildren(instance);
  instance.notifyParent?.();

  oldTransform.delete();
}