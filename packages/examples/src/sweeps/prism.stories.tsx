import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";

import { makePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["prism"];

const profiles: Record<string, React.ReactElement> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: <ReactIcon />,
};

export const Prism: React.FC<Props> = (props) => <prism {...props} />;

const range = {
  control: {
    type: "range",
    min: 0,
    max: 10,
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
    x: range,
    y: range,
    z: range,
  },
} as Meta;

interface StoryProps {
  profileName: keyof typeof profiles;
  x: number;
  y: number;
  z: number;
  rightHanded: boolean;
}

const Template: Story<StoryProps> = ({ profileName, rightHanded, ...args }) => (
  <Prism {...args}>
    <surface rightHanded={rightHanded}>{profiles[profileName]}</surface>
  </Prism>
);

export const prism = Template.bind({});
prism.args = {
  profileName: "Square",
  x: 0,
  y: 0,
  z: 1,
  rightHanded: false,
};
