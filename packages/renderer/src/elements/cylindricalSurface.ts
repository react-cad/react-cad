import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type CylindricalSurface = "cylindricalSurface";

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
  instance: ReactCADInstance<CylindricalSurface>,
  updatePayload: UpdatePayload<CylindricalSurface>
): void {
  const { radius = 1 } = updatePayload;
  instance.node.setRadius(radius);
}
