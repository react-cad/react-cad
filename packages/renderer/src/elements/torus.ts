import { ReactCADTorusNode, TorusProps } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Torus = "torus";

function validateProps(props: Props<Torus>): boolean {
  if (!props.radius1 || props.radius1 <= 0) {
    throw new Error(`torus: "radius1" prop must be greater than 0`);
  }
  if (!props.radius2 || props.radius2 <= 0) {
    throw new Error(`torus: "radius2" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Torus>,
  newProps: Props<Torus>
): UpdatePayload<Torus> | null {
  if (
    oldProps.radius1 !== newProps.radius2 ||
    oldProps.radius2 !== newProps.radius2
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Torus>,
  updatePayload: UpdatePayload<Torus>
): void {
  const props: TorusProps = Object.assign(
    {
      radius1: 1,
      radius2: 2,
    },
    updatePayload
  );
  (instance.node as ReactCADTorusNode).setProps(props);
}
