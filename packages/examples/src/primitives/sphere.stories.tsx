import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

export const Sphere: React.FC<JSX.IntrinsicElements["sphere"]> = (props) => (
  <sphere {...props} />
);

const positiveIntegerControl = {
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
  title: "Primitives/Sphere",
  component: Sphere,
  argTypes: {
    radius: positiveIntegerControl,
    angle: angleControl(0, 2 * Math.PI),
    segmentAngle1: angleControl(-Math.PI / 2 + 0.0000001, Math.PI / 2),
    segmentAngle2: angleControl(-Math.PI / 2 + 0.0000001, Math.PI / 2),
  },
} as Meta;

const Template: Story<JSX.IntrinsicElements["sphere"]> = (args) => (
  <sphere {...args} />
);

export const sphere = Template.bind({});
sphere.args = {
  radius: 5,
  angle: 0,
  segmentAngle1: 0,
  segmentAngle2: 0,
};
