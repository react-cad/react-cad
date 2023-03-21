import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Plane = "plane";

function validateProps(props: Props<Plane>): boolean {
  if (props.origin && props.origin.length < 3) {
    throw new Error(`plane: "origin" must be an array of 3 numbers`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Plane>,
  newProps: Props<Plane>
): UpdatePayload<Plane> | null {
  if (!arrayEqual(oldProps.origin, newProps.origin)) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Plane>,
  updatePayload: UpdatePayload<Plane>
): void {
  validateProps(updatePayload);
  const { origin = [0, 0, 0] } = updatePayload;
  instance.node.setOrigin(origin);
}
