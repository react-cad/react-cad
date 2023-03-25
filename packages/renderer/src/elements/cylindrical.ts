import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type CylindricalSurface = "cylindrical";

export function prepareUpdate(
  oldProps: Props<CylindricalSurface>,
  newProps: Props<CylindricalSurface>
): UpdatePayload<CylindricalSurface> | null {
  if (oldProps.radius !== newProps.radius) {
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<CylindricalSurface>,
  updatePayload: UpdatePayload<CylindricalSurface>
): void {
  const { radius = 1, origin = [0, 0, 0] } = updatePayload;
  instance.node.setRadius(radius);
  instance.node.setOrigin(origin);
}
