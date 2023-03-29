import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";
import Polygon from "./Polygon";

type Props = JSX.IntrinsicElements["helix"];

const profiles: Record<string, React.ReactElement> = {
  Square: <Polygon sides={4} />,
  Pentagon: <Polygon sides={5} />,
  Hexagon: <Polygon sides={6} />,
  SVG: <ReactIcon width={5} height={5} />,
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
  leftHanded: boolean;
}

const Template: Story<StoryProps> = ({ profileName, rotated, ...args }) => {
  return (
    <Helix {...args}>
      <planeSurface origin={rotated ? [5, 0, 0] : [0, 0, 0]}>
        {profiles[profileName]}
      </planeSurface>
    </Helix>
  );
};

export const helix = Template.bind({});
helix.args = {
  profileName: "Square",
  rotated: false,
  pitch: 10,
  height: 5,
  leftHanded: false,
};
