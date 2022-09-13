import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["cylinder"];

export const Cylinder: React.FC<Props> = (props) => <cylinder {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/Cylinder",
  component: Cylinder,
  argTypes: {
    center: { control: "boolean" },
    radius: range,
    height: range,
    angle: {
      control: {
        type: "range",
        min: 0,
        max: 2 * Math.PI,
        step: Math.PI / 100,
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Cylinder {...args} />;

export const cylinder = Template.bind({});
cylinder.args = {
  center: false,
  radius: 2,
  height: 5,
  angle: 2 * Math.PI,
};
