import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Helix = "helix";

function validateProps(props: Props<Helix>): boolean {
  if (props.pitch <= 0) {
    throw new Error(`helix: "pitch" prop must be greater than or equal to 0`);
  }
  if (props.height <= 0) {
    throw new Error(`helix: "height" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Helix>,
  newProps: Props<Helix>
): UpdatePayload<Helix> | null {
  if (
    oldProps.pitch !== newProps.pitch ||
    oldProps.height !== newProps.height
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<Helix>,
  updatePayload: UpdatePayload<Helix>
): void {
  validateProps(updatePayload);
  instance.node.setPitch(updatePayload.pitch);
  instance.node.setHeight(updatePayload.height);
}
