import React from "react";

export interface Props {
  x: number;
  y: number;
  z: number;
  axis: "x" | "y" | "z";
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
