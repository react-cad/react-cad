import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import model from "./model.stl";
import useArrayBuffer from "./useArrayBuffer";

export type Props = JSX.IntrinsicElements["stl"];

interface StoryProps {
  files: string[];
}

const Stl: React.FC<StoryProps> = ({ files }) => {
  const data = useArrayBuffer(files[0]);

  return data ? <stl data={data} /> : null;
};

export default {
  title: "Import/STL",
  component: Stl,
  argTypes: {
    files: {
      control: {
        type: "file",
        accept: "application/sla",
      },
    },
  },
} as Meta;

const Template: Story<StoryProps> = (args) => <Stl {...args} />;

export const stl = Template.bind({});
stl.storyName = "STL";
stl.args = {
  files: [model],
};
