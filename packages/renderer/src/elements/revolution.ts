import {
  ReactCADRevolutionNode,
  RevolutionProps,
  Point,
} from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Revolution = "revolution";

const AXES = ["x", "y", "z"];

function validateProps(props: Props<Revolution>): boolean {
  if (!AXES.includes(props.axis)) {
    throw new Error(`revolution: unknown axis "${props.axis}"`);
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Revolution>,
  newProps: Props<Revolution>
): UpdatePayload<Revolution> | null {
  if (
    oldProps.profile !== newProps.profile ||
    oldProps.axis !== newProps.axis ||
    oldProps.angle !== newProps.angle
  ) {
    validateProps(newProps);
    return newProps;
  }

  return null;
}

const defaultProfile: Point[] = [
  [-0.5, -0.5, 0],
  [-0.5, 0.5, 0],
  [0.5, 0.5, 0],
  [0.5, -0.5, 0],
];

export function commitUpdate(
  instance: Instance<Revolution>,
  updatePayload: UpdatePayload<Revolution>
): void {
  const { profile, ...revolutionProps } = updatePayload;
  const props: RevolutionProps = Object.assign(
    {
      axis: "z",
      angle: 0,
    },
    revolutionProps
  );
  const revolution = instance.node as ReactCADRevolutionNode;

  revolution.setProfile(profile?.length > 2 ? profile : defaultProfile);
  revolution.setProps(props);
}
