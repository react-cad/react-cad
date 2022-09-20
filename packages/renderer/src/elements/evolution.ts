import { Props, Instance, UpdatePayload } from "../types";

type Evolution = "evolution";

function validateProps(_props: Props<Evolution>): boolean {
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
