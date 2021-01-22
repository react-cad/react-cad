import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Scale = "scale";

function validateProps(props: ElementProps[Scale]): boolean {
  if (props.factor <= 0) {
    throw new Error(`scale: "factor" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  _instance: Instance<Scale>,
  _type: Scale,
  oldProps: ElementProps[Scale],
  newProps: ElementProps[Scale],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (oldProps.factor !== newProps.factor) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}
