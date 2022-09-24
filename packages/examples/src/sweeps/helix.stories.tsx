import React from "react";
import { Profile } from "react-cad";
import { Story, Meta } from "@react-cad/storybook-framework";

import reactIcon from "./react-icon";

import { makePolygon, offsetPolygon, rotatePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["helix"];

const profiles: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: reactIcon([0, 0]),
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
  let profile = profiles[profileName];
  if (rotated && typeof profile !== "string") {
    profile = offsetPolygon(rotatePolygon(profile));
  }

  return <Helix profile={profile} {...args} />;
};

export const helix = Template.bind({});
helix.args = {
  profileName: "Square",
  rotated: false,
  pitch: 10,
  height: 5,
};
