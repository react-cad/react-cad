import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["polyhedron"];

export const Polyhedron: React.FC<Props> = (props) => <polyhedron {...props} />;

export default {
  title: "Primitives/Polyhedron",
  component: Polyhedron,
  argTypes: {},
} as Meta;

const Template: Story<Props> = (args) => <Polyhedron {...args} />;

export const polyhedron = Template.bind({});
polyhedron.args = {
  points: [
    [0, 0, 0],
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  faces: [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
  ],
};
