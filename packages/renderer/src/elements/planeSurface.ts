import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";
import { arrayEqual } from "./helpers";

type PlaneSurface = "planeSurface";

function validateProps(props: Props<PlaneSurface>): boolean {
  if (props.origin && props.origin.length < 3) {
    throw new Error(`planeSurface: "origin" must be an array of 3 numbers`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<PlaneSurface>,
  newProps: Props<PlaneSurface>
): UpdatePayload<PlaneSurface> | null {
  if (!arrayEqual(oldProps.origin, newProps.origin)) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

export function commitUpdate(
  instance: CADInstance<PlaneSurface>,
  updatePayload: UpdatePayload<PlaneSurface>
): void {
  validateProps(updatePayload);
  const { origin = [0, 0, 0] } = updatePayload;
  instance.node.setOrigin(origin);
}
