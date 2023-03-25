import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Planar = "planar";

function validateProps(props: Props<Planar>): boolean {
  if (props.origin && props.origin.length < 3) {
    throw new Error(`planar: "origin" must be an array of 3 numbers`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Planar>,
  newProps: Props<Planar>
): UpdatePayload<Planar> | null {
  if (!arrayEqual(oldProps.origin, newProps.origin)) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Planar>,
  updatePayload: UpdatePayload<Planar>
): void {
  validateProps(updatePayload);
  const { origin = [0, 0, 0] } = updatePayload;
  instance.node.setOrigin(origin);
}
