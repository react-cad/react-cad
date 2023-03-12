import React from "react";
import type { Vector } from "@react-cad/core";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";
import { makePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["revolution"];

const profiles: Record<string, React.ReactElement> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: <ReactIcon />,
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
  <Revolution angle={(angle / 180) * Math.PI} {...args}>
    <surface origin={[0, 10, 0]}>{profiles[profileName]}</surface>
  </Revolution>
);

export const revolution = Template.bind({});
revolution.args = {
  profileName: "Square",
  axis: [1, 0, 0],
  angle: 90,
};
