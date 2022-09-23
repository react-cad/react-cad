import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { AxisName } from "@react-cad/core";

interface Props {
  x: number;
  y: number;
  z: number;
  axis: AxisName;
  angle: number;
}

export const Composed: React.FC<Props> = ({ x, y, z, axis, angle }) => (
  <rotation
    axis={[axis == "x" ? 1 : 0, axis == "y" ? 1 : 0, axis == "z" ? 1 : 0]}
    angle={angle}
  >
    <difference>
      <union>
        <rotation z={(1 * 2 * Math.PI) / 3}>
          <box x={x} y={y} z={z} />
        </rotation>
        <rotation z={(2 * 2 * Math.PI) / 3}>
          <box x={x} y={y} z={z} />
        </rotation>
        <rotation z={(3 * 2 * Math.PI) / 3}>
          <box x={x} y={y} z={z} />
        </rotation>
      </union>
      <translation x={0} y={0} z={z}>
        <sphere radius={4} />
      </translation>
    </difference>
  </rotation>
);

const positiveIntegerControl = {
  control: {
    type: "range",
    min: 1,
    max: 10,
    step: 0.1,
  },
};

export default {
  title: "Examples/Composed",
  component: Composed,
  argTypes: {
    x: positiveIntegerControl,
    y: positiveIntegerControl,
    z: positiveIntegerControl,
    axis: {
      options: ["x", "y", "z"],
      control: {
        type: "inline-radio",
      },
    },
    angle: {
      control: {
        type: "range",
        min: 0,
        max: 2 * Math.PI,
        step: (2 * Math.PI) / 90,
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Composed {...args} />;

export const composed = Template.bind({});
composed.args = {
  x: 5,
  y: 5,
  z: 5,
  axis: "z",
  angle: 0,
};
