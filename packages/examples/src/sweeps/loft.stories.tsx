import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

import Polygon from "./Polygon";
import Circle from "./Circle";
import Text from "./Text";

type Props = JSX.IntrinsicElements["loft"];

export const Loft: React.FC<Props> = (props) => <loft {...props} />;

export default {
  title: "Sweeps/Loft",
  component: Loft,
} as Meta;

export const loft: Story = (args) => (
  <Loft smooth={false} {...args}>
    <rotation z={Math.PI / 4}>
      <spherical radius={5}>
        <svg viewBox="0 0 10 10">
          <polygon points="-4,4 -4,-4 4,-4 4,4" />
        </svg>
      </spherical>
    </rotation>
    <translation z={10}>
      <planar>
        <svg viewBox="0 0 10 10">
          <circle r="6" />
        </svg>
      </planar>
    </translation>
    <translation z={20}>
      <planar>
        <svg viewBox="0 0 10 10">
          <ellipse rx="6" ry="4" />
        </svg>
      </planar>
    </translation>
    <translation z={30}>
      <rotation y={0.1}>
        <planar>
          <svg viewBox="0 0 10 10">
            <circle r="5" />
          </svg>
        </planar>
      </rotation>
    </translation>
  </Loft>
);

export const loft2: Story = (args) => {
  return (
    <Loft exact {...args}>
      <planar>
        <Polygon sides={6} />
      </planar>
      <planar origin={[0, 0, 5]}>
        <Circle vertices={6} />
      </planar>
      <planar origin={[0, 0, 10]}>
        <Polygon sides={3} pointsPerVertex={2} />
      </planar>
    </Loft>
  );
};

export const loft3: Story = (args) => {
  return (
    <Loft {...args}>
      <planar>
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
      </planar>
      <planar origin={[0, 0, 50]}>
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
      </planar>
      <planar origin={[0, 0, 100]}>
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
      </planar>
    </Loft>
  );
};
export const loft4: Story = ({ neckRadius = 10, neckHeight = 10 }) => {
  const angle1 =
    (180 / Math.PI) *
    Math.atan((2 * Math.PI * neckRadius * 0.99) / (neckHeight / 4));
  const angle2 =
    (180 / Math.PI) *
    Math.atan((2 * Math.PI * neckRadius * 1.05) / (neckHeight / 4));
  return (
    <union>
      <difference>
        <cylinder radius={neckRadius} height={neckHeight} />
        <cylinder radius={neckRadius} height={neckHeight} />
      </difference>
      <loft exact>
        <cylindrical radius={neckRadius * 0.99}>
          <svg viewBox="0 0 10 10">
            <g transform={`rotate(${angle1})`}>
              <ellipse
                cx={0}
                cy={neckHeight / 2}
                rx={2 * Math.PI * neckRadius * 0.99}
                ry={neckHeight / 10}
              />
            </g>
          </svg>
        </cylindrical>
        <cylindrical radius={neckRadius * 1.05}>
          <svg viewBox="0 0 10 10">
            <g transform={`rotate(${angle2})`}>
              <ellipse
                cx={0}
                cy={neckHeight / 2}
                rx={2 * Math.PI * neckRadius * 1.05}
                ry={neckHeight / 40}
              />
            </g>
          </svg>
        </cylindrical>
      </loft>
    </union>
  );
};

export const text: Story = (args) => {
  return (
    <Loft {...args}>
      <cylindrical radius={5}>
        <Text viewBox="0 0 1 1" width="2" height="2">
          ReactCAD
        </Text>
      </cylindrical>
      <cylindrical radius={8}>
        <Text viewBox="0 0 1 1" width="2" height="2">
          ReactCAD
        </Text>
      </cylindrical>
    </Loft>
  );
};

export const boat: Story = (args) => {
  return (
    <translation z={1}>
      <rotation x={-Math.PI / 2}>
        <Loft smooth exact {...args}>
          <planar origin={[1.75, 0, 0]}>
            <svg>
              <polygon points="0,0 0.5,0 0.5,0.5, 0,0.5" />
            </svg>
          </planar>
          <planar origin={[0, 0, 5]}>
            <svg>
              <path d="M 0 0 L 4 0 L 4 1 C 3 3 1 3 0 1 Z" />
            </svg>
          </planar>
          <planar origin={[0, 0, 8]}>
            <svg>
              <path d="M 0 0 L 4 0 L 4 1 C 3 3 1 3 0 1 Z" />
            </svg>
          </planar>
          <planar origin={[1.75, 0, 12]}>
            <svg>
              <polygon points="0,0 0.5,0 0.5,0.5, 0,0.5" />
            </svg>
          </planar>
        </Loft>
      </rotation>
    </translation>
  );
};
