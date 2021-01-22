import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Cylinder = "cylinder";

function validateProps(props: ElementProps[Cylinder]): boolean {
  if (props.radius <= 0) {
    throw new Error(`cylinder: "radius" prop must be greater than 0`);
  }
  if (props.height <= 0) {
    throw new Error(`cylinder: "height" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  _instance: Instance<Cylinder>,
  _type: Cylinder,
  oldProps: ElementProps[Cylinder],
  newProps: ElementProps[Cylinder],
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
