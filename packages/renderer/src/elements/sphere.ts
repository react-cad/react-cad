import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Sphere = "sphere";

function validateProps(props: ElementProps[Sphere]): boolean {
  if (props.radius <= 0) {
    throw new Error(`sphere: "radius" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  _instance: Instance<Sphere>,
  _type: Sphere,
  oldProps: ElementProps[Sphere],
  newProps: ElementProps[Sphere],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (oldProps.radius !== newProps.radius) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}
