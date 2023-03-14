import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import Polygon from "./Polygon";

type Props = JSX.IntrinsicElements["evolution"];

const spines: Record<string, React.ReactElement> = {
  Triangle: <Polygon sides={3} />,
  Square: <Polygon sides={4} />,
  Pentagon: <Polygon sides={5} />,
  Hexagon: <Polygon sides={6} />,
  SVG1: (
    <svg>
      <path fill-rule="evenodd" d="M 0,0 h10 v10 h-10 Z M 3,3 v4 h4 v-4 Z" />
    </svg>
  ),
  SVG2: (
    <svg>
      <circle r="5" />
      <circle cx="10" r="5" />
      <rect y="6" width="10" height="5" />
    </svg>
  ),
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
  profile: string;
}

const Template: Story<StoryProps> = ({ spineName, ...args }) => {
  return (
    <Evolution {...args}>
      <surface>{spines[spineName]}</surface>
    </Evolution>
  );
};

export const evolution = Template.bind({});
evolution.args = {
  spineName: "Triangle",
  profile: "M 0 0 Q 0 1.5 1 2 Q 1 3 2 4",
};
