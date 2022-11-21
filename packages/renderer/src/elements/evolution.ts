import { Props, Instance, UpdatePayload } from "../types";

type Evolution = "evolution";

function validateProps(props: Props<Evolution>): boolean {
  if (
    !props.profile ||
    (typeof props.profile === "string" && props.profile.length < 1)
  ) {
    throw new Error(`evolution: "profile" prop must be set`);
  }
  if (
    !props.spine ||
    (typeof props.spine === "string" && props.spine.length < 1)
  ) {
    throw new Error(`evolution: "spine" prop must be set`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Evolution>,
  newProps: Props<Evolution>
): UpdatePayload<Evolution> | null {
  if (
    oldProps.profile !== newProps.profile ||
    oldProps.spine !== newProps.spine
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Evolution>,
  updatePayload: UpdatePayload<Evolution>
): void {
  validateProps(updatePayload);
  const { spine, profile } = updatePayload;

  if (typeof profile === "string") {
    instance.node.setProfileSVG(profile);
  } else {
    instance.node.setProfile(profile);
  }

  if (typeof spine === "string") {
    instance.node.setSpineSVG(spine);
  } else {
    instance.node.setSpine(spine);
  }
}
