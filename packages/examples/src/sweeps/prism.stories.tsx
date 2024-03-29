import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";
import Polygon from "./Polygon";
import Text from "./Text";

type Props = JSX.IntrinsicElements["prism"];

const profiles: Record<string, React.FC<{ text: string }>> = {
  Triangle: () => <Polygon sides={3} />,
  Square: () => <Polygon sides={4} />,
  Pentagon: () => <Polygon sides={5} />,
  Hexagon: () => <Polygon sides={6} />,
  SVG: () => <ReactIcon />,
  Text: ({ text }) => <Text>{text}</Text>,
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
  text: string;
}

const Template: Story<StoryProps> = ({ profileName, text, ...args }) => {
  const Profile = profiles[profileName];
  return (
    <Prism {...args}>
      <sphericalSurface radius={15}>
        <Profile text={text} />
      </sphericalSurface>
    </Prism>
  );
};

export const prism = Template.bind({});
prism.args = {
  profileName: "Square",
  x: 0,
  y: 0,
  z: 1,
  text: "Text",
};
