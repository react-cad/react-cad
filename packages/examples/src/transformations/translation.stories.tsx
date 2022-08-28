import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

interface Props {
  x: number;
  y: number;
  z: number;
}

export const Translation: React.FC<Props> = (props) => (
  <translation {...props}>
    <box center x={5} y={5} z={5} />
  </translation>
);

const range = {
  control: {
    type: "range",
    min: -10,
    max: 10,
    step: 0.2,
  },
};

export default {
  title: "Transformations/Translation",
  component: Translation,
  argTypes: {
    x: range,
    y: range,
    z: range,
  },
} as Meta;

const Template: Story<Props> = (args) => <Translation {...args} />;

export const translation = Template.bind({});
translation.args = {
  x: 0,
  y: 0,
  z: 0,
};
