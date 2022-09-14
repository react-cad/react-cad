import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.step";

type Props = JSX.IntrinsicElements["step"];

export const Step: React.FC<Props> = (props) => <step {...props} />;

export default {
  title: "Import/STEP",
  component: Step,
  argTypes: {
    src: {
      control: "text",
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Step {...args} />;

export const step = Template.bind({});
step.storyName = "STEP";
step.args = {
  src: model,
};
