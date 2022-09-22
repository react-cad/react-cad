import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Point, Profile } from "@react-cad/core";

import reactIcon from "./react-icon";

import { makePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["evolution"];

const spines: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: reactIcon([0, 0]),
};

export const Evolution: React.FC<Props> = (props) => <evolution {...props} />;

export default {
  title: "Sweeps/Evolution",
  component: Evolution,
  argTypes: {},
} as Meta;

interface StoryProps {
  spineName: keyof typeof spines;
  profile: Point[] | string;
}

const Template: Story<StoryProps> = ({ spineName, ...args }) => {
  return <Evolution spine={spines[spineName]} {...args} />;
};

export const evolution = Template.bind({});
evolution.args = {
  spine: "M 0 0 L 0 5 L 5 5 Q 7.5 2.5 5 0 Z",
  profile: "M 0 0 Q 0 -1.5 1 -2 Q 1 -3 2 -4",
};
