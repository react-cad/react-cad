import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Prism = "prism";

function getVector(props: Props<Prism>): [number, number, number] {
  return "vector" in props
    ? props.vector
    : [props.x || 0, props.y || 0, props.z || 0];
}

function validateProps(props: Props<Prism>): boolean {
  const vector = getVector(props);
  if (vector.length < 3) {
    throw new Error(`prism: "vector" must be an array of 3 numbers`);
  }
  const total = Math.abs(vector[0]) + Math.abs(vector[1]) + Math.abs(vector[2]);
  if (total == 0) {
    throw new Error(`prism: "vector" must have length > 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Prism>,
  newProps: Props<Prism>
): UpdatePayload<Prism> | null {
  const oldVector = getVector(oldProps);
  const newVector = getVector(newProps);
  if (!arrayEqual(oldVector, newVector)) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<Prism>,
  updatePayload: UpdatePayload<Prism>
): void {
  validateProps(updatePayload);
  const vector = getVector(updatePayload);
  instance.node.setVector(vector);
}
