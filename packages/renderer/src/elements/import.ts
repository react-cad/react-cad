import { nanoid } from "nanoid";

import { Props, Instance, UpdatePayload } from "../types";

type Import = "stl" | "step" | "obj";

export function validateProps(props: Props<Import>): boolean {
  if (
    !props.data ||
    (typeof props.data === "string" && props.data.length === 0) ||
    (typeof props.data !== "string" && props.data.byteLength === 0)
  ) {
    throw new Error(
      `import: "data" prop must be a string or ArrayBuffer with content`
    );
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Import>,
  newProps: Props<Import>
): UpdatePayload<Import> | null {
  if (oldProps.data !== newProps.data) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Import>,
  updatePayload: UpdatePayload<Import>
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
