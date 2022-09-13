import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

interface Props {
  center: boolean;
  radius1: number;
  radius2: number;
  height: number;
  angle: number;
}

export const Cone: React.FC<Props> = (props) => <cone {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/Cone",
  component: Cone,
  argTypes: {
    center: { control: "boolean" },
    radius1: range,
    radius2: range,
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

const Template: Story<Props> = (args) => <Cone {...args} />;

export const cone = Template.bind({});
cone.args = {
  center: false,
  radius1: 2,
  radius2: 1,
  height: 5,
  angle: 2 * Math.PI,
};
