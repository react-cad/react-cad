import { Props, Instance, UpdatePayload } from "../types";

import { arrayEqual } from "./helpers";

type Rotation = "rotation";

const AXES = ["x", "y", "z"];

function validateProps(props: Props<Rotation>): boolean {
  if ("quaternion" in props) {
    if (props.quaternion.length !== 4) {
      throw new Error(`rotation: quaternion needs 4 values`);
    }
  } else {
    if (typeof props.axis === "string" && !AXES.includes(props.axis)) {
      throw new Error(`rotation: unknown axis "${props.axis}"`);
    }
    if (typeof props.axis !== "string" && props.axis.length !== 3) {
      throw new Error(`rotation: axis needs 3 values`);
    }
    if (typeof props.angle !== "number") {
      throw new Error(`rotation: "angle" must be greater than 0`);
    }
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Rotation>,
  newProps: Props<Rotation>
): UpdatePayload<Rotation> | null {
  if (
    "axis" in oldProps !== "axis" in newProps ||
    ("axis" in oldProps &&
      "axis" in newProps &&
      (oldProps.angle !== newProps.angle ||
        typeof oldProps.axis !== typeof newProps.axis ||
        (typeof oldProps.axis === "string" &&
          oldProps.axis !== newProps.axis) ||
        (typeof oldProps.axis !== "string" &&
          typeof newProps.axis !== "string" &&
          !arrayEqual(oldProps.axis, newProps.axis)))) ||
    ("quaternion" in oldProps &&
      "quaternion" in newProps &&
      !arrayEqual(oldProps.quaternion, newProps.quaternion))
  ) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: Instance<Rotation>,
  updatePayload: UpdatePayload<Rotation>
): void {
  if ("quaternion" in updatePayload) {
    instance.node.setRotation(updatePayload.quaternion);
  } else if (typeof updatePayload.axis === "string") {
    instance.node.setAxisNameAngle(updatePayload.axis, updatePayload.angle);
  } else {
    instance.node.setAxisAngle(updatePayload.axis, updatePayload.angle);
  }
}
