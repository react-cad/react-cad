import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import { Composed, Props } from "./Composed";

const positiveIntegerControl = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Examples/Composed",
  component: Composed,
  argTypes: {
    x: positiveIntegerControl,
    y: positiveIntegerControl,
    z: positiveIntegerControl,
    axis: {
      options: ["x", "y", "z"],
      control: {
        type: "inline-radio",
      },
    },
    angle: {
      control: {
        type: "range",
        min: 0,
        max: 2 * Math.PI,
        step: (2 * Math.PI) / 90,
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Composed {...args} />;

export const composed = Template.bind({});
composed.args = {
  x: 5,
  y: 5,
  z: 5,
  axis: "z",
  angle: 0,
};
