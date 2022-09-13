import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["wedge"];

export const Wedge: React.FC<Props> = (props) => <wedge {...props} />;

const range = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

const rangeZero = {
  control: {
    type: "range",
    min: 0,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Primitives/Wedge",
  component: Wedge,
  argTypes: {
    x: range,
    y: range,
    z: range,
    useLtx: {
      name: "type",
      options: [true, false],
      control: {
        type: "inline-radio",
        labels: { true: "use ltx", false: "use xmin, xmax, zmin, zmax" },
      },
    },
    ltx: rangeZero,
    xmin: rangeZero,
    xmax: rangeZero,
    zmin: rangeZero,
    zmax: rangeZero,
  },
} as Meta;

const Template: Story<Props & { useLtx: boolean }> = ({
  useLtx,
  ltx,
  xmin,
  xmax,
  zmin,
  zmax,
  ...args
}) => <Wedge {...args} {...(useLtx ? { ltx } : { xmin, xmax, zmin, zmax })} />;

export const wedge = Template.bind({});
wedge.args = {
  x: 5,
  y: 5,
  z: 5,
  useLtx: true,
  ltx: 2.5,
  xmin: 0,
  xmax: 0,
  zmin: 0,
  zmax: 0,
};
