import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Axis, Polygon, Point } from "@react-cad/core";
import { ReactCADElements } from "@react-cad/renderer/src/types";

function makePolygon(sides: number) {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = (i / sides) * 2 * Math.PI;
      return [0, 2 + Math.sin(theta), Math.cos(theta)];
    }
  );
}

const profiles: Record<string, Polygon> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
};

export const Revolution: React.FC<ReactCADElements["revolution"]> = (props) => (
  <revolution {...props} />
);

export default {
  title: "Sweeps/Revolution",
  component: Revolution,
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
    angle: {
      control: {
        type: "range",
        min: 0.1,
        max: Math.ceil(2 * Math.PI),
        step: 0.1,
      },
    },
  },
} as Meta;

interface Props {
  profileName: keyof typeof profiles;
  axis: Axis;
  angle: number;
}

const Template: Story<Props> = ({ profileName, ...args }) => (
  <Revolution profile={profiles[profileName]} {...args} />
);

export const revolution = Template.bind({});
revolution.args = {
  profileName: "Square",
  axis: "z",
  angle: Math.PI,
};
