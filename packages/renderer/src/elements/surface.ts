import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Surface = "surface";

function validateVector(name: string, vector?: [number, number, number]): void {
  if (vector) {
    if (vector.length < 3) {
      throw new Error(`surface: "${name}" must be an array of 3 numbers`);
    }
    const total =
      Math.abs(vector[0]) + Math.abs(vector[1]) + Math.abs(vector[2]);
    if (total == 0) {
      throw new Error(`surface: "${name}" must have length > 0`);
    }
  }
}

function validateProps(props: Props<Surface>): boolean {
  (["origin", "normal", "xDirection"] as const).forEach((prop) =>
    validateVector(prop, props[prop])
  );

  return true;
}

export function prepareUpdate(
  oldProps: Props<Surface>,
  newProps: Props<Surface>
): UpdatePayload<Surface> | null {
  if (
    !arrayEqual(oldProps.normal, newProps.normal) ||
    !arrayEqual(oldProps.origin, newProps.origin) ||
    !arrayEqual(oldProps.xDirection, newProps.xDirection)
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<Surface>,
  updatePayload: UpdatePayload<Surface>
): void {
  validateProps(updatePayload);
  const {
    origin = [0, 0, 0],
    normal = [0, 0, 1],
    xDirection = [1, 0, 0],
  } = updatePayload;
  instance.node.setOrigin(origin);
  instance.node.setNormal(normal);
  instance.node.setXDirection(xDirection);
}
