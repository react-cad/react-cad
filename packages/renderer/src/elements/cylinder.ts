import { ReactCADCylinderNode, CylinderProps } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Cylinder = "cylinder";

function validateProps(props: Props<Cylinder>): boolean {
  if (props.radius <= 0) {
    throw new Error(`cylinder: "radius" prop must be greater than 0`);
  }
  if (props.height <= 0) {
    throw new Error(`cylinder: "height" prop must be greater than 0`);
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
    oldProps.height !== newProps.height
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
  const props: CylinderProps = Object.assign(
    {
      center: false,
      radius: 1,
      height: 1,
    },
    updatePayload
  );
  (instance.node as ReactCADCylinderNode).setProps(props);
}
