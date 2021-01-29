import React from "react";
import { Story, Meta } from "@storybook/react";

interface Props {
  pitch: number;
  height: number;
}

const Helix: React.FC<Props> = (props) => <helix {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/helix",
  component: Helix,
  argTypes: {
    pitch: range,
    height: range,
  },
} as Meta;

const Template: Story<Props> = (args) => <Helix {...args} />;

export const helix = Template.bind({});
helix.args = {
  pitch: 2,
  height: 5,
};
