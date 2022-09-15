import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.obj";
import useArrayBuffer from "./useArrayBuffer";

export type Props = JSX.IntrinsicElements["obj"];

interface StoryProps {
  files: string[];
}

const Obj: React.FC<StoryProps> = ({ files }) => {
  const data = useArrayBuffer(files[0]);

  return data ? <obj data={data} /> : null;
};

export default {
  title: "Import/OBJ",
  component: Obj,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/octet-stream",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <Obj {...args} />;

export const obj = Template.bind({});
obj.storyName = "OBJ";
obj.args = {
  files: [model],
};
