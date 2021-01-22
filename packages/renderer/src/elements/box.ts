import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Box = "box";

export function validateProps(props: ElementProps[Box]): boolean {
  if (!props.x || props.x <= 0) {
    throw new Error(`box: "x" prop must be greater than 0`);
  }
  if (!props.y || props.y <= 0) {
    throw new Error(`box: "y" prop must be greater than 0`);
  }
  if (!props.z || props.z <= 0) {
    throw new Error(`box: "z" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  _instance: Instance<Box>,
  _type: Box,
  oldProps: ElementProps[Box],
  newProps: ElementProps[Box],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}
