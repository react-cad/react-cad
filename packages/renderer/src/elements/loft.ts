import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Loft = "loft";

export function prepareUpdate(
  oldProps: Props<Loft>,
  newProps: Props<Loft>
): UpdatePayload<Loft> | null {
  if (
    oldProps.exact !== newProps.exact ||
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
  const { exact = false, smooth = true } = updatePayload;
  instance.node.setExact(exact);
  instance.node.setSmooth(smooth);
}
