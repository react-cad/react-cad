import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Affine = "affine";

function validateProps(props: Props<Affine>): boolean {
  if (!arrayEqual(props.matrix[3], [0, 0, 0, 1])) {
    throw new Error(
      `affine: "matrix" must be an affine transformation matrix with last row [0,0,0,1]`
    );
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Affine>,
  newProps: Props<Affine>
): UpdatePayload<Affine> | null {
  if (
    !arrayEqual(oldProps.matrix[0], newProps.matrix[0]) ||
    !arrayEqual(oldProps.matrix[1], newProps.matrix[1]) ||
    !arrayEqual(oldProps.matrix[2], newProps.matrix[2])
  ) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: CADInstance<Affine>,
  updatePayload: UpdatePayload<Affine>
): void {
  validateProps(updatePayload);
  instance.node.setMatrix(updatePayload.matrix);
}
