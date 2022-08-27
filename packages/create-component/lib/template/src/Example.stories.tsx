import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import Example, { Props } from "./Example";

const range = (from: number, to: number) => ({
  control: {
    type: "range",
    min: from,
    max: to,
    step: 0.1,
  },
});

const meta: Meta = {
  title: "Example",
  component: Example,
  argTypes: {
    boxSize: range(5, 15),
    sphereSize: range(3, 10),
  },
};

export default meta;

const Template: Story<Props> = (args) => <Example {...args} />;

export const example = Template.bind({});

example.args = {
  boxSize: 5,
  sphereSize: 3.5 
};
