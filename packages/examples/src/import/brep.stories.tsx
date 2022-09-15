import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.brep";
import useArrayBuffer from "./useArrayBuffer";

export type Props = JSX.IntrinsicElements["brep"];

interface StoryProps {
  files: string[];
}

const BRep: React.FC<StoryProps> = ({ files }) => {
  const data = useArrayBuffer(files[0]);

  return data ? <brep data={data} /> : null;
};

export default {
  title: "Import/BREP",
  component: BRep,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/octet-stream",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <BRep {...args} />;

export const brep = Template.bind({});
brep.storyName = "BREP";
brep.args = {
  files: [model],
};
