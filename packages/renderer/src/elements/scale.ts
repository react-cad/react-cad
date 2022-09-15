import { ScaleProps } from "@react-cad/core";

import { Props, Instance, UpdatePayload } from "../types";

type Scale = "scale";

function validateProps(props: Props<Scale>): boolean {
  if (props.factor <= 0) {
    throw new Error(`scale: "factor" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Scale>,
  newProps: Props<Scale>
): UpdatePayload<Scale> | null {
  if (oldProps.factor !== newProps.factor) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

export function commitUpdate(
  instance: Instance<Scale>,
  updatePayload: UpdatePayload<Scale>
): void {
  const props: ScaleProps = Object.assign(
    {
      factor: 1,
    },
    updatePayload
  );

  instance.node.setProps(props);
}
