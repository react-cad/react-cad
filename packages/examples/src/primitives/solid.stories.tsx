import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["solid"];

const Solid: React.FC<Props> = (props) => <solid {...props} />;

export default {
  title: "Primitives/Solid",
  component: Solid,
  argTypes: {},
} as Meta;

export const cube: Story<Props> = (args) => (
  <solid {...args}>
    <plane>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </plane>
    <plane normal={[0, 1, 0]} xDirection={[0, 0, 1]}>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </plane>
    <plane normal={[1, 0, 0]} xDirection={[0, 1, 0]}>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </plane>
    <plane origin={[0, 0, 1]}>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </plane>
    <plane origin={[0, 1, 0]} normal={[0, 1, 0]} xDirection={[0, 0, 1]}>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </plane>
    <plane origin={[1, 0, 0]} normal={[1, 0, 0]} xDirection={[0, 1, 0]}>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </plane>
  </solid>
);

export const polyhedron: Story<Props> = (args) => (
  <solid {...args}>
    <plane>
      <svg viewBox="0 0 10 10">
        <polygon points="0,0 1,0 0,1" />
      </svg>
    </plane>
    <plane normal={[0, 1, 0]} xDirection={[0, 0, 1]}>
      <svg viewBox="0 0 10 10">
        <polygon points="0,0 1,0 0,1" />
      </svg>
    </plane>
    <plane normal={[1, 0, 0]} xDirection={[0, 1, 0]}>
      <svg viewBox="0 0 10 10">
        <polygon points="0,0 1,0 0,1" />
      </svg>
    </plane>
    <plane origin={[0, 1, 0]} normal={[1, 1, 1]} xDirection={[1, -1, 0]}>
      <svg viewBox="0 0 10 10">
        <polygon
          points={`0,0 ${Math.sqrt(2)},0 ${Math.sqrt(2) / 2},${
            -(Math.sqrt(2) * Math.sqrt(3)) / 2
          }`}
        />
      </svg>
    </plane>
  </solid>
);
