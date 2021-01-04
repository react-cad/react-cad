import React from "react";
import { Story, Meta } from "@storybook/react";

interface Props {
  x: number;
  y: number;
  z: number;
}

const Box: React.FC<Props> = ({ x, y, z }) => <box x={x} y={y} z={z} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1
  }
};

export default {
  title: "Primitives/box",
  component: Box,
  argTypes: {
    x: range,
    y: range,
    z: range
  }
} as Meta;

const Template: Story<Props> = args => <Box {...args} />;

export const box = Template.bind({});
box.args = {
  x: 5,
  y: 5,
  z: 5
};
