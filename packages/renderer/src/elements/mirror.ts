import { Props, Instance, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Mirror = "mirror";

function validateProps(props: Props<Mirror>): boolean {
  if (props.origin.length !== 3) {
    throw new Error(`mirror: "normal" must be array with size 3`);
  }
  if (props.normal.length !== 3) {
    throw new Error(`mirror: "normal" must be array with size 3`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Mirror>,
  newProps: Props<Mirror>
): UpdatePayload<Mirror> | null {
  if (
    !arrayEqual(oldProps.origin, newProps.origin) ||
    !arrayEqual(oldProps.normal, newProps.normal)
  ) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: Instance<Mirror>,
  updatePayload: UpdatePayload<Mirror>
): void {
  validateProps(updatePayload);
  instance.node.setPlane(updatePayload.origin, updatePayload.normal);
}
