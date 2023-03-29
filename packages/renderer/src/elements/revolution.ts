import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Revolution = "revolution";

function validateProps(props: Props<Revolution>): boolean {
  if (props.axis.length !== 3) {
    throw new Error(`revolution: axis must be a vector of 3 numbers`);
  }
  if (typeof props.angle !== "number") {
    throw new Error(`revolution: "angle" must be a number`);
  }
  if (props.angle <= 0) {
    throw new Error(`revolution: "angle" must be greater than zero`);
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Revolution>,
  newProps: Props<Revolution>
): UpdatePayload<Revolution> | null {
  if (
    !arrayEqual(oldProps.axis, newProps.axis) ||
    oldProps.angle !== newProps.angle
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Revolution>,
  updatePayload: UpdatePayload<Revolution>
): void {
  validateProps(updatePayload);
  const { axis, angle } = updatePayload;
  instance.node.setAxisAngle(axis, angle);
}
