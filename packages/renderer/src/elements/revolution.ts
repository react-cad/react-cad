import { Point } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type Revolution = "revolution";

function validateProps(props: Props<Revolution>): boolean {
  if (props.axis.length !== 3) {
    throw new Error(`revolution: axis must be a vector of 3 numbers`);
  }
  if (typeof props.angle !== "number") {
    throw new Error(`revolution: "angle" must be a number`);
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Revolution>,
  newProps: Props<Revolution>
): UpdatePayload<Revolution> | null {
  if (
    oldProps.profile !== newProps.profile ||
    !arrayEqual(oldProps.axis, newProps.axis) ||
    oldProps.angle !== newProps.angle
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

const defaultProfile: Point[] = [
  [-0.5, -0.5, 0],
  [-0.5, 0.5, 0],
  [0.5, 0.5, 0],
  [0.5, -0.5, 0],
];

export function commitUpdate(
  instance: Instance<Revolution>,
  updatePayload: UpdatePayload<Revolution>
): void {
  validateProps(updatePayload);
  const { profile, axis, angle } = updatePayload;

  if (typeof profile === "string") {
    instance.node.setProfileSVG(profile);
  } else {
    instance.node.setProfile(profile?.length > 2 ? profile : defaultProfile);
  }

  instance.node.setAxisAngle(axis, angle);
}
