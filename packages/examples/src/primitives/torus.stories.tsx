import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["torus"];

export const Torus: React.FC<Props> = (props) => <torus {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

const angleControl = (min: number, max: number) => ({
  control: {
    type: "range",
    min,
    max,
    step: Math.PI / 100,
  },
});

export default {
  title: "Primitives/Torus",
  component: Torus,
  argTypes: {
    radius1: range,
    radius2: range,
    angle: angleControl(0, 2 * Math.PI),
  },
} as Meta;

const Template: Story<Props> = (args) => <Torus {...args} />;

export const torus = Template.bind({});
torus.args = {
  radius1: 6,
  radius2: 2,
  angle: 0,
};
