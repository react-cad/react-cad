import React from "react";
import { Story, Meta } from "@storybook/react";

interface Props {
  factor: number;
}

const Scale: React.FC<Props> = (props) => (
  <scale {...props}>
    <box x={1} y={1} z={1} />
  </scale>
);

const range = {
  control: {
    type: "range",
    min: 0.1,
    max: 2,
    step: 0.1,
  },
};

export default {
  title: "Transformations/scale",
  component: Scale,
  argTypes: {
    factor: range,
  },
} as Meta;

const Template: Story<Props> = (args) => <Scale {...args} />;

export const scale = Template.bind({});
scale.args = {
  factor: 1,
};
