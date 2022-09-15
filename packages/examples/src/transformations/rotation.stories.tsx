import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { AxisName, Quaternion, Vector } from "@react-cad/core";

type Props = JSX.IntrinsicElements["rotation"];

export const Rotation: React.FC<Props> = (props) => (
  <rotation {...props}>
    <box center x={5} y={5} z={5} />
  </rotation>
);

export default {
  title: "Transformations/Rotation",
  component: Rotation,
  argTypes: {
    use: {
      options: ["axis name and angle", "axis vector and angle", "quaternion"],
      control: {
        type: "inline-radio",
      },
    },
    axisName: {
      options: ["x", "y", "z"],
      control: {
        type: "inline-radio",
      },
    },
    angle: {
      control: {
        type: "range",
        min: -Math.PI,
        max: Math.PI,
        step: 0.1,
      },
    },
  },
} as Meta;

interface StoryProps {
  use: string;
  axisName: AxisName;
  angle: number;
  axis: Vector;
  quaternion: Quaternion;
}

const Template: Story<StoryProps> = ({
  use,
  axisName,
  angle,
  axis,
  quaternion,
}) => {
  switch (use) {
    case "axis name and angle":
      return <Rotation axis={axisName} angle={angle} />;
    case "axis vector and angle":
      return <Rotation axis={axis} angle={angle} />;
    case "quaternion":
      return <Rotation quaternion={quaternion} />;
  }
  return <Rotation quaternion={[0, 0, 0, 1]} />;
};

export const rotation = Template.bind({});
rotation.args = {
  use: "axis name and angle",
  angle: 0,
  axisName: "z",
  axis: [0, 0, 1],
  quaternion: [0, 0, 0, 1],
};
