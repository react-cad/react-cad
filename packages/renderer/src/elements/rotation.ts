import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

import { arrayEqual } from "./helpers";

type Rotation = "rotation";

function validateProps(props: Props<Rotation>): boolean {
  if ("quaternion" in props) {
    if (props.quaternion.length !== 4) {
      throw new Error(`rotation: quaternion needs 4 values`);
    }
  } else if ("axis" in props) {
    if (props.axis.length !== 3) {
      throw new Error(`rotation: axis needs 3 values`);
    }
    if (typeof props.angle !== "number") {
      throw new Error(`rotation: "angle" must be a number`);
    }
  } else {
    if (typeof props.x !== "undefined" && typeof props.x !== "number") {
      throw new Error(`rotation: "angle" must be a number`);
    }
    if (typeof props.y !== "undefined" && typeof props.y !== "number") {
      throw new Error(`rotation: "angle" must be a number`);
    }
    if (typeof props.z !== "undefined" && typeof props.z !== "number") {
      throw new Error(`rotation: "angle" must be a number`);
    }
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Rotation>,
  newProps: Props<Rotation>
): UpdatePayload<Rotation> | null {
  let changed = false;

  if ("axis" in oldProps && "axis" in newProps) {
    // Axis
    changed =
      oldProps.angle !== newProps.angle ||
      !arrayEqual(oldProps.axis, newProps.axis);
  } else if ("quaternion" in oldProps && "quaternion" in newProps) {
    // Quaternion
    changed = !arrayEqual(oldProps.quaternion, newProps.quaternion);
  } else if (
    !("quaternion" in oldProps) &&
    !("quaternion" in newProps) &&
    !("axis" in oldProps) &&
    !("axis" in newProps)
  ) {
    // Euler
    changed =
      oldProps.x !== newProps.x ||
      oldProps.y !== newProps.y ||
      oldProps.z !== newProps.z;
  } else {
    changed = true;
  }

  if (changed) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Rotation>,
  updatePayload: UpdatePayload<Rotation>
): void {
  validateProps(updatePayload);
  if ("quaternion" in updatePayload) {
    instance.node.setRotation(updatePayload.quaternion);
  } else if ("axis" in updatePayload) {
    instance.node.setAxisAngle(updatePayload.axis, updatePayload.angle);
  } else {
    instance.node.setEulerAngles(
      updatePayload.x || 0,
      updatePayload.y || 0,
      updatePayload.z || 0
    );
  }
}
