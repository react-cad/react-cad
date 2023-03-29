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
      <sphericalSurface radius={5}>
        <svg viewBox="0 0 10 10">
          <polygon points="-4,4 -4,-4 4,-4 4,4" />
        </svg>
      </sphericalSurface>
    </rotation>
    <translation z={10}>
      <planeSurface>
        <svg viewBox="0 0 10 10">
          <circle r="6" />
        </svg>
      </planeSurface>
    </translation>
    <translation z={20}>
      <planeSurface>
        <svg viewBox="0 0 10 10">
          <ellipse rx="6" ry="4" />
        </svg>
      </planeSurface>
    </translation>
    <translation z={30}>
      <rotation y={0.1}>
        <planeSurface>
          <svg viewBox="0 0 10 10">
            <circle r="5" />
          </svg>
        </planeSurface>
      </rotation>
    </translation>
  </Loft>
);

export const loft2: Story = (args) => {
  return (
    <Loft exact {...args}>
      <planeSurface>
        <Polygon sides={6} />
      </planeSurface>
      <planeSurface origin={[0, 0, 5]}>
        <Circle vertices={6} />
      </planeSurface>
      <planeSurface origin={[0, 0, 10]}>
        <Polygon sides={3} pointsPerVertex={2} />
      </planeSurface>
    </Loft>
  );
};

export const loft3: Story = (args) => {
  return (
    <Loft {...args}>
      <planeSurface>
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
      </planeSurface>
      <planeSurface origin={[0, 0, 50]}>
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
      </planeSurface>
      <planeSurface origin={[0, 0, 100]}>
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
      </planeSurface>
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
        <cylindricalSurface radius={neckRadius * 0.99}>
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
        </cylindricalSurface>
        <cylindricalSurface radius={neckRadius * 1.05}>
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
        </cylindricalSurface>
      </loft>
    </union>
  );
};

export const text: Story = (args) => {
  return (
    <Loft {...args}>
      <cylindricalSurface radius={5}>
        <Text viewBox="0 0 1 1" width="2" height="2">
          ReactCAD
        </Text>
      </cylindricalSurface>
      <cylindricalSurface radius={8}>
        <Text viewBox="0 0 1 1" width="2" height="2">
          ReactCAD
        </Text>
      </cylindricalSurface>
    </Loft>
  );
};

export const boat: Story = (args) => {
  return (
    <translation z={1}>
      <rotation x={-Math.PI / 2}>
        <Loft smooth exact {...args}>
          <planeSurface origin={[1.75, 0, 0]}>
            <svg>
              <polygon points="0,0 0.5,0 0.5,0.5, 0,0.5" />
            </svg>
          </planeSurface>
          <planeSurface origin={[0, 0, 5]}>
            <svg>
              <path d="M 0 0 L 4 0 L 4 1 C 3 3 1 3 0 1 Z" />
            </svg>
          </planeSurface>
          <planeSurface origin={[0, 0, 8]}>
            <svg>
              <path d="M 0 0 L 4 0 L 4 1 C 3 3 1 3 0 1 Z" />
            </svg>
          </planeSurface>
          <planeSurface origin={[1.75, 0, 12]}>
            <svg>
              <polygon points="0,0 0.5,0 0.5,0.5, 0,0.5" />
            </svg>
          </planeSurface>
        </Loft>
      </rotation>
    </translation>
  );
};
