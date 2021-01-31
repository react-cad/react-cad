import { ReactCADPrismNode, PrismProps, Point } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Prism = "prism";

const AXES = ["x", "y", "z"];

function validateProps(props: Props<Prism>): boolean {
  if (!AXES.includes(props.axis)) {
    throw new Error(`prism: unknown axis "${props.axis}"`);
  }
  if (props.height <= 0) {
    throw new Error(`prism: "height" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Prism>,
  newProps: Props<Prism>
): UpdatePayload<Prism> | null {
  if (
    oldProps.profile !== newProps.profile ||
    oldProps.axis !== newProps.axis ||
    oldProps.height !== newProps.height
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
  instance: Instance<Prism>,
  updatePayload: UpdatePayload<Prism>
): void {
  const { profile, ...prismProps } = updatePayload;
  const props: PrismProps = Object.assign(
    {
      axis: "z",
      height: 1,
    },
    prismProps
  );
  const prism = instance.node as ReactCADPrismNode;

  prism.setProfile(profile?.length > 2 ? profile : defaultProfile);
  prism.setProps(props);
}
