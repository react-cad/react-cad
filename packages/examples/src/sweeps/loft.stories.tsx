import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import Polygon from "./Polygon";
import Circle from "./Circle";

type Props = JSX.IntrinsicElements["loft"];

export const Loft: React.FC<Props> = (props) => <loft {...props} />;

export default {
  title: "Sweeps/Loft",
  component: Loft,
} as Meta;

export const loft: Story = (args) => (
  <Loft {...args}>
    <rotation axis={[0, 1, 0]} angle={-Math.PI / 2}>
      <sphericalSurface radius={5}>
        <svg viewBox="0.5 0.5 1 1">
          <g transform="scale(0.1,0.1) ">
            <polygon points="5,0 10,5 5,10 0,5" />
          </g>
        </svg>
      </sphericalSurface>
    </rotation>
    <plane origin={[0, 0, 10]}>
      <svg viewBox="0 0 10 10">
        <circle r="6" />
      </svg>
    </plane>
    <plane origin={[0, 0, 20]}>
      <svg viewBox="0 0 10 10">
        <ellipse rx="6" ry="4" />
      </svg>
    </plane>
    <plane origin={[0, 0, 30]} normal={[0.3, 0, 1]} xDirection={[0, 1, 0]}>
      <svg viewBox="0 0 10 10">
        <circle r="5" />
      </svg>
    </plane>
  </Loft>
);

export const loft2: Story = (args) => {
  return (
    <Loft compatible {...args}>
      <plane>
        <Polygon sides={6} />
      </plane>
      <plane origin={[0, 0, 5]}>
        <Circle vertices={6} />
      </plane>
      <plane origin={[0, 0, 10]}>
        <Polygon sides={3} pointsPerVertex={2} />
      </plane>
    </Loft>
  );
};

export const loft3: Story = (args) => {
  return (
    <Loft {...args}>
      <plane>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="svgGroup"
            stroke-linecap="round"
            fill-rule="evenodd"
            font-size="9pt"
            stroke="#000"
            stroke-width="0.25mm"
            fill="none"
          >
            <path
              d="M 50 50 m -50 0 a 50 50 0 0 1 100 0 a 50 50 0 0 1 -100 0 z M 50 50 m -20 0 a 20 20 0 0 1 40 0 a 20 20 0 0 1 -40 0 z"
              vector-effect="non-scaling-stroke"
            />
          </g>
        </svg>
      </plane>
      <plane origin={[0, 0, 50]}>
        <svg
          width="100"
          height="100"
          viewBox="-50 -50 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="svgGroup"
            stroke-linecap="round"
            fill-rule="evenodd"
            font-size="9pt"
            stroke="#000"
            stroke-width="0.25mm"
            fill="none"
          >
            <path d="M -50 -50 l 100 0 a 50 50 0 1 1 0 100 l -100 0 l 0 -100 Z M -25 -25 l 50 0 a 25 25 0 1 1 0 50 l -50 0 l 0 -50 Z" />
          </g>
        </svg>
      </plane>
      <plane origin={[0, 0, 100]}>
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="svgGroup"
            stroke-linecap="round"
            fill-rule="evenodd"
            font-size="9pt"
            stroke="#000"
            stroke-width="0.25mm"
            fill="none"
          >
            <path
              d="M 50 50 m -50 0 a 50 50 0 0 1 100 0 a 50 50 0 0 1 -100 0 z M 50 50 m -20 0 a 20 20 0 0 1 40 0 a 20 20 0 0 1 -40 0 z"
              vector-effect="non-scaling-stroke"
            />
          </g>
        </svg>
      </plane>
    </Loft>
  );
};
