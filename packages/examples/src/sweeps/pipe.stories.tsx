import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import Polygon from "./Polygon";

type Props = JSX.IntrinsicElements["pipe"];

const profiles: Record<string, React.ReactElement> = {
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

export const Pipe: React.FC<Props> = (props) => <pipe {...props} />;

export default {
  title: "Sweeps/Pipe",
  component: Pipe,
  argTypes: {
    profileName: {
      options: Object.keys(profiles),
      control: {
        type: "select",
      },
    },
  },
} as Meta;

interface StoryProps {
  profileName: keyof typeof profiles;
  spine: string;
}

const Template: Story<StoryProps> = ({ profileName, ...args }) => {
  return (
    <Pipe {...args}>
      <plane>{profiles[profileName]}</plane>
    </Pipe>
  );
};

export const pipe = Template.bind({});
pipe.args = {
  profileName: "Triangle",
  spine: "M 0 0 L 0 10 Q 0 30 20 30 T 50 50",
};
