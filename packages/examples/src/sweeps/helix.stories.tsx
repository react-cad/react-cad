import React from "react";
import { Story, Meta } from "@storybook/react";
import { Point } from "@react-cad/core";

interface Props {
  profile: string;
  pitch: number;
  height: number;
}

const profiles: Record<string, Point[]> = {
  "XY Square": [
    [1, 1, 0],
    [1, -1, 0],
    [-1, -1, 0],
    [-1, 1, 0],
  ],
  "Offset XY Square": [
    [0, 0, 0],
    [0, 1, 0],
    [1, 1, 0],
    [1, 0, 0],
  ],
  "XZ Square": [
    [0, 0, 0],
    [0, 0, 1],
    [1, 0, 1],
    [1, 0, 0],
  ],
};

const Helix: React.FC<Props> = ({ profile, ...props }) => (
  <helix profile={profiles[profile]} {...props} />
);

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Sweeps/helix",
  component: Helix,
  argTypes: {
    profile: {
      control: {
        type: "select",
        options: Object.keys(profiles),
      },
    },
    pitch: range,
    height: range,
  },
} as Meta;

const Template: Story<Props> = (args) => <Helix {...args} />;

export const helix = Template.bind({});
helix.args = {
  profile: "XY Square",
  pitch: 2,
  height: 5,
};
