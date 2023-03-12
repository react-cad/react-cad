import { ReactCADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Pipe = "pipe";

function validateProps(_props: Props<Pipe>): boolean {
  return true;
}

export function prepareUpdate(
  oldProps: Props<Pipe>,
  newProps: Props<Pipe>
): UpdatePayload<Pipe> | null {
  if (oldProps.spine !== newProps.spine) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: ReactCADInstance<Pipe>,
  updatePayload: UpdatePayload<Pipe>
): void {
  validateProps(updatePayload);
  instance.node.setSpine(updatePayload.spine);
}
