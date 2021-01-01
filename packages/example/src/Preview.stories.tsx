import React from "react";
import { Story, Meta } from "@storybook/react";

interface Props {
  x: number;
  y: number;
  z: number;
}

const Box: React.FC<Props> = (props) => <box {...props} />;

export default {
  title: "Box",
  component: Box,
} as Meta;

const Template: Story<{ x: number; y: number; z: number; }> = args => (
  <Box {...args} />
);

export const Default = Template.bind({});
Default.args = {
  x: 5,
  y: 5,
  z: 5
};
