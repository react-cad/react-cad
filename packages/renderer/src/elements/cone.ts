import { Props, Instance, UpdatePayload } from "../types";

type Cone = "cone";

function validateProps(props: Props<Cone>): boolean {
  if (props.radius1 <= 0) {
    throw new Error(`cylinder: "radius1" prop must be greater than 0`);
  }
  if (props.radius2 <= 0 || props.radius2 >= props.radius1) {
    throw new Error(
      `cylinder: "radius2" prop must be greater than 0 and less than "radius1"`
    );
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
  oldProps: Props<Cone>,
  newProps: Props<Cone>
): UpdatePayload<Cone> | null {
  if (
    oldProps.center !== newProps.center ||
    oldProps.radius1 !== newProps.radius1 ||
    oldProps.radius2 !== newProps.radius2 ||
    oldProps.height !== newProps.height ||
    oldProps.angle !== newProps.angle
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Cone>,
  updatePayload: UpdatePayload<Cone>
): void {
  const {
    center = false,
    radius1 = 1,
    radius2 = 1,
    height = 1,
    angle = 0,
  } = updatePayload;
  instance.node.setSize(radius1, radius2, height);
  instance.node.setAngle(angle);
  instance.node.setCentered(center);
}
