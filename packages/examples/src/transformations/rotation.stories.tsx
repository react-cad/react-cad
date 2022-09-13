import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["rotation"];

export const Rotation: React.FC<Props> = ({ axis, angle }) => (
  <rotation axis={axis} angle={angle}>
    <box center x={5} y={5} z={5} />
  </rotation>
);

export default {
  title: "Transformations/Rotation",
  component: Rotation,
  argTypes: {
    axis: {
      options: ["x", "y", "z"],
      control: {
        type: "inline-radio",
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
