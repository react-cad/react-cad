import { Props, Instance, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Scale = "scale";

function validateProps(props: Props<Scale>): boolean {
  if ("factor" in props && props.factor <= 0) {
    throw new Error(`scale: "factor" prop must be greater than 0`);
  }
  if (!("factor" in props)) {
    if (props.x && props.x <= 0) {
      throw new Error(`scale: "x" must be greater than 0`);
    }
    if (props.y && props.y <= 0) {
      throw new Error(`scale: "y" must be greater than 0`);
    }
    if (props.z && props.z <= 0) {
      throw new Error(`scale: "z" must be greater than 0`);
    }
  }
  if (props.center && props.center.length !== 3) {
    throw new Error(`scale: "center" prop must be an an array with 3 values`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Scale>,
  newProps: Props<Scale>
): UpdatePayload<Scale> | null {
  if (
    "factor" in oldProps != "factor" in newProps ||
    ("factor" in oldProps &&
      "factor" in newProps &&
      oldProps.factor !== newProps.factor) ||
    (!("factor" in oldProps) &&
      !("factor" in newProps) &&
      (oldProps.x !== newProps.x ||
        oldProps.y !== newProps.y ||
        oldProps.z !== newProps.z)) ||
    Boolean(oldProps.center) != Boolean(newProps.center) ||
    (oldProps.center &&
      newProps.center &&
      !arrayEqual(oldProps.center, newProps.center))
  ) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: Instance<Scale>,
  updatePayload: UpdatePayload<Scale>
): void {
  instance.node.setCenter(updatePayload.center || [0, 0, 0]);
  if ("factor" in updatePayload) {
    instance.node.setScaleFactor(updatePayload.factor || 1);
  } else {
    instance.node.setScale([
      updatePayload.x || 1,
      updatePayload.y || 1,
      updatePayload.z || 1,
    ]);
  }
}
