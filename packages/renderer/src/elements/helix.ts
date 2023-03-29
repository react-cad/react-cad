import { CADInstance } from "instance";
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
    oldProps.height !== newProps.height ||
    oldProps.leftHanded !== newProps.leftHanded
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Helix>,
  updatePayload: UpdatePayload<Helix>
): void {
  validateProps(updatePayload);
  const { pitch, height, leftHanded = false } = updatePayload;
  instance.node.setPitch(pitch);
  instance.node.setHeight(height);
  instance.node.setLeftHanded(leftHanded);
}
