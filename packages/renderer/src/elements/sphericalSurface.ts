import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type SphericalSurface = "sphericalSurface";

function validateProps(props: Props<SphericalSurface>): boolean {
  if (props.origin && props.origin.length < 3) {
    throw new Error(`sphericalSurface: "origin" must be an array of 3 numbers`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<SphericalSurface>,
  newProps: Props<SphericalSurface>
): UpdatePayload<SphericalSurface> | null {
  if (
    !arrayEqual(oldProps.origin, newProps.origin) ||
    oldProps.radius !== newProps.radius
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<SphericalSurface>,
  updatePayload: UpdatePayload<SphericalSurface>
): void {
  validateProps(updatePayload);
  const { origin = [0, 0, 0], radius = 1 } = updatePayload;
  instance.node.setOrigin(origin);
  instance.node.setRadius(radius);
}
