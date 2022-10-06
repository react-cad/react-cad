import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Quaternion, Vector } from "@react-cad/core";

type Props = JSX.IntrinsicElements["rotation"];

export const Rotation: React.FC<Props> = (props) => (
  <rotation {...props}>
    <box center x={5} y={5} z={5} />
  </rotation>
);

const range = {
  control: {
    type: "range",
    min: -Math.PI,
    max: Math.PI,
    step: 0.1,
  },
};

export default {
  title: "Transformations/Rotation",
  component: Rotation,
  argTypes: {
    use: {
      options: ["axis vector and angle", "euler angles", "quaternion"],
      control: {
        type: "inline-radio",
      },
    },
    angle: range,
    x: range,
    y: range,
    z: range,
  },
} as Meta;

interface StoryProps {
  use: string;
  angle: number;
  axis: Vector;
  x: number;
  y: number;
  z: number;
  quaternion: Quaternion;
}

const Template: Story<StoryProps> = ({
  use,
  angle,
  axis,
  x,
  y,
  z,
  quaternion,
}) => {
  switch (use) {
    case "axis vector and angle":
      return <Rotation axis={axis} angle={angle} />;
    case "euler angles":
      return <Rotation x={x} y={y} z={z} />;
    case "quaternion":
      return <Rotation quaternion={quaternion} />;
  }
  return <Rotation quaternion={[0, 0, 0, 1]} />;
};

export const rotation = Template.bind({});
rotation.args = {
  use: "axis name and angle",
  angle: 0,
  axis: [0, 0, 1],
  x: 0,
  y: 0,
  z: 0,
  quaternion: [0, 0, 0, 1],
};
