import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Evolution = "evolution";

function validateProps(props: Props<Evolution>): boolean {
  if (
    !props.profile ||
    (typeof props.profile === "string" && props.profile.length < 1)
  ) {
    throw new Error(`evolution: "profile" prop must be set`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Evolution>,
  newProps: Props<Evolution>
): UpdatePayload<Evolution> | null {
  if (oldProps.profile !== newProps.profile) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Evolution>,
  updatePayload: UpdatePayload<Evolution>
): void {
  validateProps(updatePayload);
  instance.node.setProfile(updatePayload.profile);
}
