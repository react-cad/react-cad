import { Props, Instance, UpdatePayload } from "../types";

type Pipe = "pipe";

function validateProps(_props: Props<Pipe>): boolean {
  return true;
}

export function prepareUpdate(
  oldProps: Props<Pipe>,
  newProps: Props<Pipe>
): UpdatePayload<Pipe> | null {
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
  instance: Instance<Pipe>,
  updatePayload: UpdatePayload<Pipe>
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
