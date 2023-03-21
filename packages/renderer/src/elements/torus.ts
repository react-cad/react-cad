import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

type Torus = "torus";

function validateProps(props: Props<Torus>): boolean {
  if (!props.radius1 || props.radius1 <= 0) {
    throw new Error(`torus: "radius1" prop must be greater than 0`);
  }
  if (!props.radius2 || props.radius2 <= 0) {
    throw new Error(`torus: "radius2" prop must be greater than 0`);
  }
  if (props.angle && (props.angle <= 0 || props.angle > 2 * Math.PI)) {
    throw new Error(
      `torus: "angle" prop must be greater than 0 and less than or equal to 2π`
    );
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Torus>,
  newProps: Props<Torus>
): UpdatePayload<Torus> | null {
  if (
    oldProps.radius1 !== newProps.radius2 ||
    oldProps.radius2 !== newProps.radius2 ||
    oldProps.angle !== newProps.angle
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<Torus>,
  updatePayload: UpdatePayload<Torus>
): void {
  validateProps(updatePayload);
  const { radius1 = 1, radius2 = 2, angle = 0 } = updatePayload;
  instance.node.setSize(radius1, radius2);
  instance.node.setAngle(angle);
}
