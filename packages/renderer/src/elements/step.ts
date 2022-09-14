import { Props, Instance, UpdatePayload } from "../types";

type STEPImport = "step";

export function validateProps(props: Props<STEPImport>): boolean {
  if (!props.src || props.src.length === 0) {
    throw new Error(`step: "src" prop must be a string`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<STEPImport>,
  newProps: Props<STEPImport>
): UpdatePayload<STEPImport> | null {
  if (oldProps.src !== newProps.src) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<STEPImport>,
  updatePayload: UpdatePayload<STEPImport>
): void {
  instance.node.setSrc(updatePayload.src || "");
}
