import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

export const Union: React.FC = (props) => (
  <union {...props}>
    <box x={5} y={5} z={1} />
    <sphere radius={3} />
  </union>
);

export default {
  title: "Operations/Union",
  component: Union,
} as Meta;

const Template: Story = (args) => <Union {...args} />;

export const union = Template.bind({});
