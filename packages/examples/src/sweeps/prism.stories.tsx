import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import ReactIcon from "./react-icon";
import Polygon from "./Polygon";
import Text from "./Text";

type Props = JSX.IntrinsicElements["prism"];

const profiles: Record<string, React.ComponentType<{ radius?: number }>> = {
  Triangle: ({ radius = 10 }) => (
    <Polygon sides={3} radius={1} viewBox="0 0 1 1" width="1" height={radius} />
  ),
  Square: ({ radius = 10 }) => (
    <Polygon sides={4} radius={1} viewBox="0 0 1 1" width="1" height={radius} />
  ),
  Pentagon: ({ radius = 10 }) => (
    <Polygon sides={5} radius={1} viewBox="0 0 1 1" width="1" height={radius} />
  ),
  Hexagon: ({ radius = 10 }) => (
    <Polygon sides={6} radius={1} viewBox="0 0 1 1" width="1" height={radius} />
  ),
  SVG: ({ radius = 10 }) => (
    <ReactIcon viewBox="0 0 1 1" width="1" height={radius} />
  ),
  Hello: ({ radius = 10 }) => (
    <Text viewBox="0 0 1 1" width="1" height={radius}>
      Hello
    </Text>
  ),
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
}

const Template: Story<StoryProps> = ({ profileName, ...args }) => {
  const Profile = profiles[profileName];
  return (
    <rotation y={-Math.PI / 2} z={Math.PI}>
      <Prism {...args}>
        <cylindricalSurface radius={10}>
          <Profile radius={10} />
        </cylindricalSurface>
      </Prism>
    </rotation>
  );
};

export const prism = Template.bind({});
prism.args = {
  profileName: "Square",
  x: 0,
  y: 0,
  z: 1,
};
