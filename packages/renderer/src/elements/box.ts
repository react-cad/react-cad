import { ReactCADBoxNode, BoxProps } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Box = "box";

export function validateProps(props: Props<Box>): boolean {
  if (!props.x || props.x <= 0) {
    throw new Error(`box: "x" prop must be greater than 0`);
  }
  if (!props.y || props.y <= 0) {
    throw new Error(`box: "y" prop must be greater than 0`);
  }
  if (!props.z || props.z <= 0) {
    throw new Error(`box: "z" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Box>,
  newProps: Props<Box>
): UpdatePayload<Box> | null {
  if (
    oldProps.center !== newProps.center ||
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: Instance<Box>,
  updatePayload: UpdatePayload<Box>
): void {
  const props: BoxProps = Object.assign(
    {
      center: false,
      x: 1,
      y: 1,
      z: 1,
    },
    updatePayload
  );
  (instance.node as ReactCADBoxNode).setProps(props);
}
