import React from "react";
import { Story, Meta } from "@storybook/react";

type Axis = "x" | "y" | "z";

interface Props {
  x: number;
  y: number;
  z: number;
  axis: Axis;
  angle: number;
}

const Box: React.FC<Props> = ({ x, y, z, axis, angle }) => 
  <rotation axis={axis} angle={angle}>
    <box x={x} y={y} z={z} />
  </rotation>

const positiveIntegerControl = {
  control: {
    type: "range",
    min: 1,
    max: 100,
    step: 1
  }
}

export default {
  title: "Box",
  component: Box,
  argTypes: {
    x: positiveIntegerControl,
    y: positiveIntegerControl,
    z: positiveIntegerControl,
    axis: {
      control: {
        type: "inline-radio",
        options: ["x", "y", "z"]
      }
    },
    angle: {
      control: {
        type: "range",
        min: 0,
        max: 2 * Math.PI,
        step: 2 * Math.PI / 360
      }
    }
  }
} as Meta;

const Template: Story<Props> = args => (
  <Box {...args} />
);

export const Default = Template.bind({});
Default.args = {
  x: 5,
  y: 5,
  z: 5,
  axis: "z",
  angle: 0
};
