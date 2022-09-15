import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.step";
import useArrayBuffer from "./useArrayBuffer";

export type Props = JSX.IntrinsicElements["step"];

interface StoryProps {
  files: string[];
}

const Step: React.FC<StoryProps> = ({ files }) => {
  const data = useArrayBuffer(files[0]);

  return data ? <step data={data} /> : null;
};

export default {
  title: "Import/STEP",
  component: Step,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/STEP",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <Step {...args} />;

export const step = Template.bind({});
step.storyName = "STEP";
step.args = {
  files: [model],
};
