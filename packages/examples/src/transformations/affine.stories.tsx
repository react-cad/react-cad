import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["affine"];

export const Affine: React.FC<Props> = (props) => (
  <affine {...props}>
    <box center x={5} y={5} z={5} />
  </affine>
);

export default {
  title: "Transformations/Affine",
  component: Affine,
} as Meta;

const Template: Story<Props> = (args) => <Affine {...args} />;

export const affine = Template.bind({});
affine.args = {
  matrix: [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
};
