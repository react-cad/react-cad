import React from "react";
import { Story, Meta } from "@storybook/react";

interface Props {
  radius1: number;
  radius2: number;
}

const Torus: React.FC<Props> = (props) => <torus {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/torus",
  component: Torus,
  argTypes: {
    radius1: range,
    radius2: range,
  },
} as Meta;

const Template: Story<Props> = (args) => <Torus {...args} />;

export const torus = Template.bind({});
torus.args = {
  radius1: 6,
  radius2: 2,
};
