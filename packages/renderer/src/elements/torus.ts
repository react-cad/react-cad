import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Torus = "torus";

function validateProps(props: ElementProps[Torus]): boolean {
  if (!props.radius1 || props.radius1 <= 0) {
    throw new Error(`torus: "radius1" prop must be greater than 0`);
  }
  if (!props.radius2 || props.radius2 <= 0) {
    throw new Error(`torus: "radius2" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  _instance: Instance<Torus>,
  _type: Torus,
  oldProps: ElementProps[Torus],
  newProps: ElementProps[Torus],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (
    oldProps.radius1 !== newProps.radius2 ||
    oldProps.radius2 !== newProps.radius2
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}
