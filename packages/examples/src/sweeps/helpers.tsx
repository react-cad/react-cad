import React from "react";
import type { Polygon } from "@react-cad/core";

export function makePolygon(sides: number): React.ReactElement {
  return (
    <svg viewBox="0 0 10 10">
      <polygon
        points={[...Array(sides)].reduce((points, _, i) => {
          const theta = Math.PI / sides + (i / sides) * 2 * Math.PI;
          return `${points} ${Math.sin(theta) * 5},${-Math.cos(theta) * 5}`;
        }, "")}
      />
    </svg>
  );
}

export function rotatePolygon(polygon: Polygon): Polygon {
  return polygon.map(([x, y, z]) => [x, z, y]);
}
