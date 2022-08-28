import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

interface Props {
  radius: number;
}

export const Sphere: React.FC<Props> = (props) => <sphere {...props} />;

const positiveIntegerControl = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/Sphere",
  component: Sphere,
  argTypes: {
    radius: positiveIntegerControl,
  },
} as Meta;

const Template: Story<Props> = (args) => <Sphere {...args} />;

export const sphere = Template.bind({});
sphere.args = {
  radius: 5,
};
