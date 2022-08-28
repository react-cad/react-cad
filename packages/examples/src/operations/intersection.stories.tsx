import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

export const Intersection: React.FC = (props) => (
  <intersection {...props}>
    <sphere radius={2} />
    <box x={5} y={5} z={1} />
    <rotation axis="z" angle={-Math.PI / 4}>
      <box y={5} x={1} z={1} />
    </rotation>
  </intersection>
);

export default {
  title: "Operations/Intersection",
  component: Intersection,
} as Meta;

const Template: Story = (args) => <Intersection {...args} />;

export const intersection = Template.bind({});
