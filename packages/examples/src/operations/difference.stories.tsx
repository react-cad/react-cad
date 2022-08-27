import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

export const Difference: React.FC = (props) => (
  <difference {...props}>
    <sphere radius={3} />
    <box center x={6} y={6} z={1} />
    <box center x={1} y={1} z={6} />
  </difference>
);

export default {
  title: "Operations/Difference",
  component: Difference,
} as Meta;

const Template: Story = (args) => <Difference {...args} />;

export const difference = Template.bind({});
