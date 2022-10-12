import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import { Example, Props } from "./Example.js";

export default {
  title: "Example",
  component: Example,
  argTypes: {
    boxSize: {
      control: {
        type: "range",
        min: 5,
        max: 15,
        step: 0.1,
      },
    },
    sphereSize: {
      control: {
        type: "range",
        min: 3,
        max: 10,
        step: 0.1
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Example {...args} />;

export const example = Template.bind({});
example.args = {
  boxSize: 5,
  sphereSize: 3.5 
};
