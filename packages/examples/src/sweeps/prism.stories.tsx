import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { AxisName, Profile } from "@react-cad/core";

import reactIcon from "./react-icon";

import { makePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["prism"];

const profiles: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: reactIcon([0, 0]),
};

export const Prism: React.FC<Props> = (props) => <prism {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 5,
    step: 1,
  },
};

export default {
  title: "Sweeps/Prism",
  component: Prism,
  argTypes: {
    profileName: {
      options: Object.keys(profiles),
      control: {
        type: "select",
      },
    },
    axis: {
      options: ["x", "y", "z"],
      control: {
        type: "inline-radio",
      },
    },
    height: range,
  },
} as Meta;

interface StoryProps {
  profileName: keyof typeof profiles;
  axis: AxisName;
  height: number;
}

const Template: Story<StoryProps> = ({ profileName, ...args }) => (
  <Prism profile={profiles[profileName]} {...args} />
);

export const prism = Template.bind({});
prism.args = {
  profileName: "Square",
  axis: "z",
  height: 5,
};
