import React from "react";
import { Story, Meta } from "@storybook/react";

type Axis = "x" | "y" | "z";

interface Props {
  axis: Axis;
  angle: number;
}

const Rotation: React.FC<Props> = ({ axis, angle }) => (
  <rotation axis={axis} angle={angle}>
    <box center x={5} y={5} z={5} />
  </rotation>
);

export default {
  title: "Transformations/rotation",
  component: Rotation,
  argTypes: {
    axis: {
      control: {
        type: "inline-radio",
        options: ["x", "y", "z"],
      },
    },
    angle: {
      control: {
        type: "range",
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Rotation {...args} />;

export const rotation = Template.bind({});
rotation.args = {
  axis: "z",
  angle: 0,
};
