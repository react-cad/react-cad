import { ReactCADSphereNode, SphereProps } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Sphere = "sphere";

function validateProps(props: Props<Sphere>): boolean {
  if (props.radius <= 0) {
    throw new Error(`sphere: "radius" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Sphere>,
  newProps: Props<Sphere>
): UpdatePayload<Sphere> | null {
  if (oldProps.radius !== newProps.radius) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Sphere>,
  updatePayload: UpdatePayload<Sphere>
): void {
  const props: SphereProps = Object.assign(
    {
      radius: 1,
    },
    updatePayload
  );
  (instance.node as ReactCADSphereNode).setProps(props);
}
