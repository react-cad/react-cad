import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["mirror"];

export const Mirror: React.FC<Props> = (props) => (
  <union>
    <translation x={5}>
      <box x={5} y={5} z={5} />
    </translation>
    <mirror {...props}>
      <translation x={5}>
        <box x={5} y={5} z={5} />
      </translation>
    </mirror>
  </union>
);

export default {
  title: "Transformations/Mirror",
  component: Mirror,
} as Meta;

const Template: Story<Props> = (args) => <Mirror {...args} />;

export const mirror = Template.bind({});
mirror.args = {
  origin: [0, 0, 0],
  normal: [1, 0, 0],
};
