import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Point, Polygon, Profile } from "@react-cad/core";
import { ReactCADElements } from "@react-cad/renderer/src/types";

import reactIcon from "./react-icon";

function makePolygon(sides: number) {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = Math.PI / sides + (i / sides) * 2 * Math.PI;
      return [Math.sin(theta), Math.cos(theta), 0];
    }
  );
}

function offsetPolygon(polygon: Polygon): Polygon {
  return polygon.map(([x, y, z]) => [x + 1.5, y, z]);
}

function rotatePolygon(polygon: Polygon): Polygon {
  return polygon.map(([x, y, z]) => [x, z, y]);
}

const profiles: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG: reactIcon,
};

export const Helix: React.FC<ReactCADElements["helix"]> = (props) => (
  <helix {...props} />
);

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
        min: 1,
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
  pitch: 5,
  height: 5,
};
