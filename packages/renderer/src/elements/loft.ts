import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Loft = "loft";

export function prepareUpdate(
  oldProps: Props<Loft>,
  newProps: Props<Loft>
): UpdatePayload<Loft> | null {
  if (
    oldProps.compatible !== newProps.compatible ||
    oldProps.smooth !== newProps.smooth
  ) {
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Loft>,
  updatePayload: UpdatePayload<Loft>
): void {
  const { compatible = false, smooth = true } = updatePayload;
  instance.node.setCompatible(compatible);
  instance.node.setSmooth(smooth);
}
