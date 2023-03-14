import React from "react";
import type { Vector } from "@react-cad/core";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";
import Polygon from "./Polygon";

type Props = JSX.IntrinsicElements["revolution"];

const profiles: Record<string, React.ReactElement> = {
  Triangle: <Polygon sides={3} />,
  Square: <Polygon sides={4} />,
  Pentagon: <Polygon sides={5} />,
  Hexagon: <Polygon sides={6} />,
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
    <plane origin={[0, 10, 0]}>{profiles[profileName]}</plane>
  </Revolution>
);

export const revolution = Template.bind({});
revolution.args = {
  profileName: "Square",
  axis: [1, 0, 0],
  angle: 90,
};
