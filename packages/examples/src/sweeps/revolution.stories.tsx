import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Profile, Point, Vector } from "@react-cad/core";

import reactIcon from "./react-icon";

type Props = JSX.IntrinsicElements["revolution"];

function makePolygon(sides: number) {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = (i / sides) * 2 * Math.PI;
      return [0, 2 + Math.sin(theta), Math.cos(theta)];
    }
  );
}

const profiles: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: reactIcon([24, 0]),
};

export const Revolution: React.FC<Props> = (props) => <revolution {...props} />;

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
    angle: {
      control: {
        type: "range",
        min: 1,
        max: 360,
        step: 1,
      },
    },
  },
} as Meta;

interface StoryProps {
  profileName: keyof typeof profiles;
  axis: Vector;
  angle: number;
}

const Template: Story<StoryProps> = ({ profileName, angle, ...args }) => (
  <Revolution
    profile={profiles[profileName]}
    angle={(angle / 180) * Math.PI}
    {...args}
  />
);

export const revolution = Template.bind({});
revolution.args = {
  profileName: "Square",
  axis: [0, 0, 1],
  angle: 90,
};
