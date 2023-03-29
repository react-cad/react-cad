import React from "react";
import { Story, Meta } from "@react-cad/storybook-framework";

type Props = JSX.IntrinsicElements["solid"];

const Solid: React.FC<Props> = (props) => <solid {...props} />;

export default {
  title: "Primitives/Solid",
  component: Solid,
  argTypes: {},
} as Meta;

export const cube: Story<Props> = (args) => (
  <solid {...args}>
    <planeSurface>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </planeSurface>

    <rotation y={-Math.PI / 2}>
      <planeSurface>
        <svg>
          <rect width="1" height="1" />
        </svg>
      </planeSurface>
    </rotation>

    <rotation x={Math.PI / 2}>
      <planeSurface>
        <svg>
          <rect width="1" height="1" />
        </svg>
      </planeSurface>
    </rotation>

    <translation x={1}>
      <rotation y={-Math.PI / 2}>
        <planeSurface>
          <svg>
            <rect width="1" height="1" />
          </svg>
        </planeSurface>
      </rotation>
    </translation>

    <translation y={1}>
      <rotation x={Math.PI / 2}>
        <planeSurface>
          <svg>
            <rect width="1" height="1" />
          </svg>
        </planeSurface>
      </rotation>
    </translation>

    <planeSurface origin={[0, 0, 1]}>
      <svg>
        <rect width="1" height="1" />
      </svg>
    </planeSurface>
  </solid>
);

export const polyhedron: Story<Props> = (args) => (
  <solid {...args}>
    <planeSurface>
      <svg viewBox="0 0 10 10">
        <polygon points="0,0 1,0 0,1" />
      </svg>
    </planeSurface>
    <rotation x={Math.PI / 2}>
      <planeSurface>
        <svg viewBox="0 0 10 10">
          <polygon points="0,0 1,0 0,1" />
        </svg>
      </planeSurface>
    </rotation>
    <rotation y={-Math.PI / 2}>
      <planeSurface>
        <svg viewBox="0 0 10 10">
          <polygon points="0,0 1,0 0,1" />
        </svg>
      </planeSurface>
    </rotation>
    <translation y={1}>
      <rotation x={Math.PI - Math.atan(Math.sqrt(2))} z={-Math.PI / 4}>
        <planeSurface>
          <svg viewBox="0 0 10 10">
            <polygon
              points={`0,0 ${Math.sqrt(2)},0 ${Math.sqrt(2) / 2},${
                (Math.sqrt(2) * Math.sqrt(3)) / 2
              }`}
            />
          </svg>
        </planeSurface>
      </rotation>
    </translation>
  </solid>
);

export const chest: Story<Props> = (args) => (
  <solid {...args}>
    {/* Bottom */}
    <planeSurface>
      <svg>
        <rect width="10" height="6" />
      </svg>
    </planeSurface>

    {/* Sides */}
    <rotation x={Math.PI / 2}>
      <planeSurface>
        <svg>
          <rect width="10" height="3" />
        </svg>
      </planeSurface>
    </rotation>
    <translation y={6}>
      <rotation x={Math.PI / 2}>
        <planeSurface>
          <svg>
            <rect width="10" height="3" />
          </svg>
        </planeSurface>
      </rotation>
    </translation>

    {/* Ends */}
    <rotation y={-Math.PI / 2}>
      <planeSurface>
        <svg>
          <path d="M 0 0 L 3 0 A 3 3 0 0 1 3 6 L 0 6 Z" />
        </svg>
      </planeSurface>
    </rotation>
    <translation x={10}>
      <rotation y={-Math.PI / 2}>
        <planeSurface>
          <svg>
            <path d="M 0 0 L 3 0 A 3 3 0 0 1 3 6 L 0 6 Z" />
          </svg>
        </planeSurface>
      </rotation>
    </translation>

    {/* Lid */}
    <translation y={3} z={3}>
      <cylindricalSurface radius={3}>
        <svg viewBox="0 5 10 10">
          <rect height={10} width={10} />
        </svg>
      </cylindricalSurface>
    </translation>
  </solid>
);
