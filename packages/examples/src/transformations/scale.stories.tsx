import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";
import { Point, Vector } from "@react-cad/core";

type Props = JSX.IntrinsicElements["scale"];

export const Scale: React.FC<Props> = (props) => (
  <scale {...props}>
    <box x={1} y={1} z={1} />
  </scale>
);

const range = {
  control: {
    type: "range",
    min: 0.1,
    max: 2,
    step: 0.1,
  },
};

export default {
  title: "Transformations/Scale",
  component: Scale,
  argTypes: {
    useScaleFactor: {
      options: [true, false],
      name: "use",
      control: {
        type: "inline-radio",
        labels: {
          true: "scale factor",
          false: "separate scale per axis",
        },
      },
    },
    factor: range,
  },
} as Meta;

interface StoryProps {
  center: Point;
  useScaleFactor: boolean;
  factor: number;
  scale: Vector;
}

const Template: Story<StoryProps> = ({
  center,
  useScaleFactor,
  factor,
  scale,
}) => {
  if (useScaleFactor) {
    return <Scale factor={factor} center={center} />;
  } else {
    return <Scale scale={scale} center={center} />;
  }
};

export const scale = Template.bind({});
scale.args = {
  useScaleFactor: true,
  factor: 1,
  scale: [1, 1, 1],
  center: [0, 0, 0],
};
