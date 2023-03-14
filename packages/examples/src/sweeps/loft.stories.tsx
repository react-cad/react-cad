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
    <surface>
      <svg>
        <polygon points="5,0 10,5 5,10 0,5" />
      </svg>
    </surface>
    <surface origin={[0, 0, 5]}>
      <svg>
        <circle cx="5" cy="5" r="6" />
      </svg>
    </surface>
    <surface origin={[0, 0, 15]}>
      <svg viewBox="0 0 10 10">
        <ellipse cx="5" cy="5" rx="6" ry="4" />
      </svg>
    </surface>
    <surface origin={[0, 0, 30]} normal={[0.3, 0, 1]} xDirection={[0, 1, 0]}>
      <svg viewBox="0 0 10 10">
        <circle cx="5" cy="-5" r="5" />
      </svg>
    </surface>
  </Loft>
);

export const loft2: Story = (args) => {
  return (
    <Loft compatible {...args}>
      <surface>
        <Polygon sides={6} />
      </surface>
      <surface origin={[0, 0, 5]}>
        <Circle vertices={6} />
      </surface>
      <surface origin={[0, 0, 10]}>
        <Polygon sides={3} pointsPerVertex={2} />
      </surface>
    </Loft>
  );
};

export const loft3: Story = (args) => {
  return (
    <Loft {...args}>
      <surface>
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
      </surface>
      <surface origin={[0, 0, 50]}>
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
      </surface>
      <surface origin={[0, 0, 100]}>
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
      </surface>
    </Loft>
  );
};
