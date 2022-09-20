import { Point, Polygon } from "@react-cad/core";

export function makePolygon(sides: number): Polygon {
  return [...Array(sides)].map(
    (_, i): Point => {
      const theta = Math.PI / sides + (i / sides) * 2 * Math.PI;
      return [Math.sin(theta) * 10, -Math.cos(theta) * 10, 0];
    }
  );
}

export function offsetPolygon(polygon: Polygon): Polygon {
  return polygon.map(([x, y, z]) => [x + 1.5, y, z]);
}

export function rotatePolygon(polygon: Polygon): Polygon {
  return polygon.map(([x, y, z]) => [x, z, y]);
}
