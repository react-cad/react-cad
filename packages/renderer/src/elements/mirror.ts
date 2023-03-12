import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Mirror = "mirror";

function validateProps(props: Props<Mirror>): boolean {
  if (props.point && props.point.length !== 3) {
    throw new Error(`mirror: "normal" must be array with size 3`);
  }
  if (props.normal && props.normal.length !== 3) {
    throw new Error(`mirror: "normal" must be array with size 3`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Mirror>,
  newProps: Props<Mirror>
): UpdatePayload<Mirror> | null {
  if (
    !arrayEqual(oldProps.point, newProps.point) ||
    !arrayEqual(oldProps.normal, newProps.normal)
  ) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<Mirror>,
  updatePayload: UpdatePayload<Mirror>
): void {
  validateProps(updatePayload);
  instance.node.setPlane(
    updatePayload.point ?? [0, 0, 0],
    updatePayload.normal ?? [1, 0, 0]
  );
}
