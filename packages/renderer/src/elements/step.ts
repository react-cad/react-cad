import { nanoid } from "nanoid";

import { Props, Instance, UpdatePayload } from "../types";

type STEPImport = "step";

export function validateProps(props: Props<STEPImport>): boolean {
  if (
    !props.data ||
    (typeof props.data === "string" && props.data.length === 0) ||
    (typeof props.data !== "string" && props.data.byteLength === 0)
  ) {
    throw new Error(
      `step: "data" prop must be a string or ArrayBuffer with content`
    );
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<STEPImport>,
  newProps: Props<STEPImport>
): UpdatePayload<STEPImport> | null {
  if (oldProps.data !== newProps.data) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<STEPImport>,
  updatePayload: UpdatePayload<STEPImport>
): void {
  let filename = instance.node.getFilename();
  if (filename.length === 0) {
    filename = `${nanoid()}.step`;
  }
  const { data } = updatePayload;
  instance.core.FS.writeFile(
    filename,
    typeof data === "string" ? data : new Uint8Array(data)
  );
  instance.node.setFilename(filename, true);
}
