import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Axis, Point, Profile } from "@react-cad/core";
import { ReactCADElements } from "@react-cad/renderer/src/types";

import reactIcon from "./react-icon";

function makePolygon(sides: number) {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = (i / sides) * 2 * Math.PI;
      return [Math.sin(theta), Math.cos(theta), 0];
    }
  );
}

const profiles: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: reactIcon,
};

export const Prism: React.FC<ReactCADElements["prism"]> = (props) => (
  <prism {...props} />
);

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

interface Props {
  profileName: keyof typeof profiles;
  axis: Axis;
  height: number;
}

const Template: Story<Props> = ({ profileName, ...args }) => (
  <Prism profile={profiles[profileName]} {...args} />
);

export const prism = Template.bind({});
prism.args = {
  profileName: "Square",
  axis: "z",
  height: 5,
};
