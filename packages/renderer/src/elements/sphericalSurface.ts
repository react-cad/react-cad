import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type SphericalSurface = "sphericalSurface";

export function prepareUpdate(
  oldProps: Props<SphericalSurface>,
  newProps: Props<SphericalSurface>
): UpdatePayload<SphericalSurface> | null {
  if (oldProps.radius !== newProps.radius) {
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<SphericalSurface>,
  updatePayload: UpdatePayload<SphericalSurface>
): void {
  const { radius = 1, origin = [0, 0, 0] } = updatePayload;
  instance.node.setRadius(radius);
  instance.node.setOrigin(origin);
}
