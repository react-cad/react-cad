import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["box"];

export const Box: Story<Props> = (props) => <box {...props} />;
Box.args = {
  center: false,
  x: 5,
  y: 5,
  z: 5,
};

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/Box",
  component: Box,
  argTypes: {
    center: {
      control: "boolean",
    },
    x: range,
    y: range,
    z: range,
  },
  parameters: {
    docs: {
      page: null,
    },
  },
} as Meta;
