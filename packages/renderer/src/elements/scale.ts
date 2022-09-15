import { Props, Instance, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Scale = "scale";

function validateProps(props: Props<Scale>): boolean {
  if ("factor" in props && props.factor <= 0) {
    throw new Error(`scale: "factor" prop must be greater than 0`);
  }
  if ("scale" in props && props.scale.length !== 3) {
    throw new Error(`scale: "scale" prop must be an an array with 3 values`);
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
    ("scale" in oldProps &&
      "scale" in newProps &&
      !arrayEqual(oldProps.scale, newProps.scale)) ||
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
    instance.node.setScale(updatePayload.scale || [1, 1, 1]);
  }
}
