import React from "react";
import { Story, Meta } from "@storybook/react";
import { Point } from "@react-cad/core";
import { ReactCADElements } from "@react-cad/renderer/src/types";

function makePolygon(sides: number) {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = Math.PI / sides + (i / sides) * 2 * Math.PI;
      return [Math.sin(theta), Math.cos(theta), 0];
    }
  );
}

function offsetPolygon(polygon: Point[]): Point[] {
  return polygon.map(([x, y, z]) => [x + 1.5, y, z]);
}

function rotatePolygon(polygon: Point[]): Point[] {
  return polygon.map(([x, y, z]) => [x, z, y]);
}

const profiles: Record<string, Point[]> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
};

const Helix: React.FC<ReactCADElements["helix"]> = (props) => (
  <helix {...props} />
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
  title: "Sweeps/helix",
  component: Helix,
  argTypes: {
    profileName: {
      control: {
        type: "select",
        options: Object.keys(profiles),
      },
    },
    rotated: { control: "boolean" },
    pitch: range,
    height: range,
  },
} as Meta;

interface StoryProps {
  profileName: keyof typeof profiles;
  rotated: boolean;
  pitch: number;
  height: number;
}

const Template: Story<StoryProps> = ({ profileName, rotated, ...args }) => {
  const profile: Point[] = React.useMemo(() => {
    let points = profiles[profileName];
    if (rotated) {
      points = offsetPolygon(rotatePolygon(points));
    }
    return points;
  }, [profileName, rotated]);

  return <Helix profile={profile} {...args} />;
};

export const helix = Template.bind({});
helix.args = {
  profileName: "Square",
  rotated: false,
  pitch: 2,
  height: 5,
};
