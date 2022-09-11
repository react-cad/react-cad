import { ReactCADHelixNode, HelixProps, Point } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Helix = "helix";

function validateProps(props: Props<Helix>): boolean {
  if (props.pitch <= 0) {
    throw new Error(`helix: "pitch" prop must be greater than or equal to 0`);
  }
  if (props.height <= 0) {
    throw new Error(`helix: "height" prop must be greater than 0`);
  }

  return true;
}

export function prepareUpdate(
  oldProps: Props<Helix>,
  newProps: Props<Helix>
): UpdatePayload<Helix> | null {
  if (
    oldProps.profile !== newProps.profile ||
    oldProps.pitch !== newProps.pitch ||
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
  instance: Instance<Helix>,
  updatePayload: UpdatePayload<Helix>
): void {
  const { profile, ...helixProps } = updatePayload;
  const props: HelixProps = Object.assign(
    {
      pitch: 1,
      height: 1,
    },
    helixProps
  );
  const helix = instance.node as ReactCADHelixNode;

  if (typeof profile === "string") {
    helix.setSVGProfile(profile);
  } else {
    helix.setProfile(profile?.length > 2 ? profile : defaultProfile);
  }
  helix.setProps(props);
}
