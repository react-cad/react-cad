import React from "react";
import type { Point, Profile } from "@react-cad/core";
import { Story, Meta } from "@react-cad/storybook-framework";

import { makePolygon } from "./helpers";

type Props = JSX.IntrinsicElements["evolution"];

const spines: Record<string, Profile> = {
  Triangle: makePolygon(3),
  Square: makePolygon(4),
  Pentagon: makePolygon(5),
  Hexagon: makePolygon(6),
  SVG1: `
    <svg>
      <path fill-rule="evenodd" d="M 0,0 h10 v10 h-10 Z M 3,3 v4 h4 v-4 Z" />
    </svg>`,
  SVG2: `
    <svg>
      <circle r="5" />
      <circle cx="10" r="5" />
      <rect y="6" width="10" height="5" />
    </svg>`,
};

export const Evolution: React.FC<Props> = (props) => <evolution {...props} />;

export default {
  title: "Sweeps/Evolution",
  component: Evolution,
  argTypes: {
    spineName: {
      options: Object.keys(spines),
      control: {
        type: "select",
      },
    },
  },
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
  spineName: "Triangle",
  profile: "M 0 0 Q 0 -1.5 1 -2 Q 1 -3 2 -4",
};
