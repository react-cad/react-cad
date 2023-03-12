import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Translation = "translation";

function getVector(props: Props<Translation>): [number, number, number] {
  return "vector" in props
    ? props.vector
    : [props.x || 0, props.y || 0, props.z || 0];
}

export function prepareUpdate(
  oldProps: Props<Translation>,
  newProps: Props<Translation>
): UpdatePayload<Translation> | null {
  const oldVector = getVector(oldProps);
  const newVector = getVector(newProps);
  if (!arrayEqual(oldVector, newVector)) {
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<Translation>,
  updatePayload: UpdatePayload<Translation>
): void {
  const vector = getVector(updatePayload);
  instance.node.setVector(vector);
}
