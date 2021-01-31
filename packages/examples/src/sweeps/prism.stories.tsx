import React from "react";
import { Story, Meta } from "@storybook/react";
import { Axis, Point } from "@react-cad/core";
import { ReactCADElements } from "@react-cad/renderer/src/types";

function makePolygon(sides: number) {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = (i / sides) * 2 * Math.PI;
      return [Math.sin(theta), Math.cos(theta), 0];
    }
  );
}

const profiles: Record<string, Point[]> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
};

const Prism: React.FC<ReactCADElements["prism"]> = (props) => (
  <prism {...props} />
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
  title: "Sweeps/prism",
  component: Prism,
  argTypes: {
    profileName: {
      control: {
        type: "select",
        options: Object.keys(profiles),
      },
    },
    axis: {
      control: {
        type: "inline-radio",
        options: ["x", "y", "z"],
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
