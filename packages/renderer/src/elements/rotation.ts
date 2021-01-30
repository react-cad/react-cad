import { ReactCADRotationNode, RotationProps } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Rotation = "rotation";

const AXES = ["x", "y", "z"];

function validateProps(props: Props<Rotation>): boolean {
  if (!AXES.includes(props.axis)) {
    throw new Error(`rotation: unknown axis "${props.axis}"`);
  }
  if (typeof props.angle !== "number") {
    throw new Error(`rotation: expected numeric angle, got "${props.angle}"`);
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Rotation>,
  newProps: Props<Rotation>
): UpdatePayload<Rotation> | null {
  if (oldProps.axis !== newProps.axis || oldProps.angle !== newProps.angle) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: Instance<Rotation>,
  updatePayload: UpdatePayload<Rotation>
): void {
  const props: RotationProps = Object.assign(
    {
      axis: "z",
      angle: 0,
    },
    updatePayload
  );
  (instance.node as ReactCADRotationNode).setProps(props);
}
