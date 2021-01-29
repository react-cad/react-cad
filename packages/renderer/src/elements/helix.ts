import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Helix = "helix";

function validateProps(props: ElementProps[Helix]): boolean {
  if (props.pitch <= 0) {
    throw new Error(`helix: "pitch" prop must be greater than or equal to 0`);
  }
  if (props.height <= 0) {
    throw new Error(`helix: "height" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  _instance: Instance<Helix>,
  _type: Helix,
  oldProps: ElementProps[Helix],
  newProps: ElementProps[Helix],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (
    oldProps.pitch !== newProps.pitch ||
    oldProps.height !== newProps.height
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}
