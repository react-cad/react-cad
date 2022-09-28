import { Props, Instance, UpdatePayload } from "../types";

type Sphere = "sphere";

const PI_2 = Math.PI / 2;

function validateProps(props: Props<Sphere>): boolean {
  if (props.radius <= 0) {
    throw new Error(`sphere: "radius" prop must be greater than 0`);
  }
  if (props.angle && (props.angle <= 0 || props.angle > 2 * Math.PI)) {
    throw new Error(
      `sphere: "angle" prop must be greater than 0 and less than or equal to 2π`
    );
  }
  if (
    props.segmentAngle1 &&
    (props.segmentAngle1 <= -PI_2 || props.segmentAngle1 > PI_2)
  ) {
    throw new Error(
      `sphere: "segmentAngle1" prop must be greater than -π/2 and less than or equal to π/2`
    );
  }
  if (
    props.segmentAngle2 &&
    (props.segmentAngle2 <= -PI_2 ||
      props.segmentAngle2 >= (props.segmentAngle1 || 0))
  ) {
    throw new Error(
      `sphere: "segmentAngle2" prop must be greater than -π/2 and less than or equal to "segmentAngle1"`
    );
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Sphere>,
  newProps: Props<Sphere>
): UpdatePayload<Sphere> | null {
  if (
    oldProps.radius !== newProps.radius ||
    oldProps.angle !== newProps.angle ||
    oldProps.segmentAngle1 !== newProps.segmentAngle1 ||
    oldProps.segmentAngle2 !== newProps.segmentAngle2
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Sphere>,
  updatePayload: UpdatePayload<Sphere>
): void {
  const {
    radius = 1,
    angle = 0,
    segmentAngle1 = 0,
    segmentAngle2 = 0,
  } = updatePayload;
  instance.node.setRadius(radius);
  instance.node.setAngle(angle);
  instance.node.setSegment(segmentAngle1, segmentAngle2);
}
