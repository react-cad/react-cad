import { Props, Instance, UpdatePayload } from "../types";

type Cylinder = "cylinder";

function validateProps(props: Props<Cylinder>): boolean {
  if (props.radius <= 0) {
    throw new Error(`cylinder: "radius" prop must be greater than 0`);
  }
  if (props.height <= 0) {
    throw new Error(`cylinder: "height" prop must be greater than 0`);
  }
  if (props.angle && (props.angle <= 0 || props.angle > 2 * Math.PI)) {
    throw new Error(
      `cylinder: "angle" prop must be greater than 0 and less than or equal to 2π`
    );
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Cylinder>,
  newProps: Props<Cylinder>
): UpdatePayload<Cylinder> | null {
  if (
    oldProps.center !== newProps.center ||
    oldProps.radius !== newProps.radius ||
    oldProps.height !== newProps.height ||
    oldProps.angle !== newProps.angle
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Cylinder>,
  updatePayload: UpdatePayload<Cylinder>
): void {
  validateProps(updatePayload);
  const { center = false, radius = 1, height = 1, angle = 0 } = updatePayload;
  instance.node.setSize(radius, height);
  instance.node.setAngle(angle);
  instance.node.setCentered(center);
}
