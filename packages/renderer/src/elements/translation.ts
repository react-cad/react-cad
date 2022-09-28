import { Props, Instance, UpdatePayload } from "../types";

type Translation = "translation";

export function prepareUpdate(
  oldProps: Props<Translation>,
  newProps: Props<Translation>
): UpdatePayload<Translation> | null {
  if (
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z
  ) {
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: Instance<Translation>,
  updatePayload: UpdatePayload<Translation>
): void {
  const { x = 0, y = 0, z = 0 } = updatePayload;
  instance.node.setVector([x, y, z]);
}
