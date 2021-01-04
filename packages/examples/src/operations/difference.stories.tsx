import React from "react";
import { Story, Meta } from "@storybook/react";

const Difference: React.FC = props => (
  <difference {...props}>
    <sphere radius={3} />
    <box x={5} y={5} z={1} />
    <box x={1} y={1} z={3} />
  </difference>
);

export default {
  title: "Operations/difference",
  component: Difference,
} as Meta;

const Template: Story = args => <Difference {...args} />;

export const difference = Template.bind({});
