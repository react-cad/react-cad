import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Helix = "helix";

function validateProps(props: ElementProps[Helix]): boolean {
  if (props.radius <= 0) {
    throw new Error(`helix: "radius" prop must be greater than or equal to 0`);
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
    oldProps.radius !== newProps.radius ||
    oldProps.height !== newProps.height
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}
