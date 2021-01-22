import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Rotation = "rotation";

const AXES = ["x", "y", "z"];

function validateProps(props: ElementProps[Rotation]): boolean {
  if (!AXES.includes(props.axis)) {
    throw new Error(`rotation: unknown axis "${props.axis}"`);
  }
  if (typeof props.angle !== "number") {
    throw new Error(`rotation: expected numeric angle, got "${props.angle}"`);
  }
  return true;
}

export function prepareUpdate(
  _instance: Instance<Rotation>,
  _type: Rotation,
  oldProps: ElementProps[Rotation],
  newProps: ElementProps[Rotation],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (oldProps.axis !== newProps.axis || oldProps.angle !== newProps.angle) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}
