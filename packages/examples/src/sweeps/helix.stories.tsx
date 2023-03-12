import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";

import { makePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["helix"];

const profiles: Record<string, React.ReactElement> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: <ReactIcon />,
};

export const Helix: React.FC<Props> = (props) => <helix {...props} />;

export default {
  title: "Sweeps/Helix",
  component: Helix,
  argTypes: {
    profileName: {
      options: Object.keys(profiles),
      control: {
        type: "select",
      },
    },
    rotated: { control: "boolean" },
    pitch: {
      control: {
        type: "range",
        min: 10,
        max: 50,
        step: 5,
      },
    },
    height: {
      control: {
        type: "range",
        min: 1,
        max: 5,
        step: 1,
      },
    },
  },
} as Meta;

interface StoryProps {
  profileName: keyof typeof profiles;
  rotated: boolean;
  pitch: number;
  height: number;
}

const Template: Story<StoryProps> = ({ profileName, rotated, ...args }) => {
  return (
    <Helix {...args}>
      <surface>{profiles[profileName]}</surface>
    </Helix>
  );
};

export const helix = Template.bind({});
helix.args = {
  profileName: "Square",
  rotated: false,
  pitch: 10,
  height: 5,
};
