import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Wedge = "wedge";

export function validateProps(props: Props<Wedge>): boolean {
  if (!props.x || props.x <= 0) {
    throw new Error(`wedge: "x" prop must be greater than 0`);
  }
  if (!props.y || props.y <= 0) {
    throw new Error(`wedge: "y" prop must be greater than 0`);
  }
  if (!props.z || props.z <= 0) {
    throw new Error(`wedge: "z" prop must be greater than 0`);
  }

  if ("ltx" in props) {
    if (props.ltx < 0) {
      throw new Error(`wedge: "ltx" prop must be greater than or equal to 0`);
    }
  }
  if ("xmin" in props) {
    if (props.xmax < props.xmin) {
      throw new Error(
        `wedge: "xmax" prop must be greater than or equal to "xmin"`
      );
    }
    if (props.zmax < props.zmin) {
      throw new Error(
        `wedge: "zmax" prop must be greater than or equal to "zmin"`
      );
    }
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Wedge>,
  newProps: Props<Wedge>
): UpdatePayload<Wedge> | null {
  if (
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z ||
    "ltx" in oldProps !== "ltx" in newProps ||
    ("ltx" in oldProps && "ltx" in newProps && oldProps.ltx != newProps.ltx) ||
    "xmin" in oldProps != "xmin" in newProps ||
    ("xmin" in newProps &&
      "xmin" in oldProps &&
      (oldProps.xmin != newProps.xmin ||
        oldProps.xmax != newProps.xmax ||
        oldProps.zmin != newProps.zmin ||
        oldProps.zmax != newProps.zmax))
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Wedge>,
  updatePayload: UpdatePayload<Wedge>
): void {
  validateProps(updatePayload);
  const { x = 1, y = 1, z = 1 } = updatePayload;
  instance.node.setSize([x, y, z]);
  if ("ltx" in updatePayload) {
    instance.node.setLtx(updatePayload.ltx);
  } else {
    const { xmin = 0, xmax = 1, zmin = 0, zmax = 0 } = updatePayload;
    instance.node.setMinMax(xmin, xmax, zmin, zmax);
  }
}
