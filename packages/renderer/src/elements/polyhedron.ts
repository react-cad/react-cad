import { Point } from "@react-cad/core";
import { CADInstance } from "instance";
import { Props, UpdatePayload } from "../types";

import { arrayEqual } from "./helpers";

type Polyhedron = "polyhedron";

function validateProps(props: Props<Polyhedron>): boolean {
  if (props.points.length < 4) {
    throw new Error(`polyhedron: "points" prop must contain at least 4 points`);
  }
  if (props.faces.length < 4) {
    throw new Error(`polyhedron: "faces" prop must contain at least 4 faces`);
  }
  for (let face = 0; face < props.faces.length; ++face) {
    if (props.faces[face].length < 3) {
      throw new Error(
        `polyhedron: "faces[${face}]" face must contain at least 3 points`
      );
    }

    for (let point = 0; point < props.faces[face].length; ++point) {
      if (
        props.faces[face][point] < 0 ||
        props.faces[face][point] >= props.points.length
      ) {
        throw new Error(
          `polyhedron: "faces[${face}][${point}]" point ${props.faces[face][point]} out of bounds`
        );
      }
    }
  }
  return true;
}

function pointsEqual(point1: Point, point2: Point) {
  return (
    point1[0] !== point2[0] ||
    point1[1] !== point2[1] ||
    point1[2] !== point2[2]
  );
}

function pointsArrayEqual(points1: Point[], points2: Point[]) {
  for (let i = 0; i < points1.length; i++) {
    if (!pointsEqual(points1[i], points2[i])) {
      return false;
    }
  }
  return true;
}

function facesArrayEqual(a: number[][], b: number[][]) {
  for (let i = 0; i < a.length; i++) {
    if (!arrayEqual(a[i], b[i])) {
      return false;
    }
  }
  return true;
}

export function prepareUpdate(
  oldProps: Props<Polyhedron>,
  newProps: Props<Polyhedron>
): UpdatePayload<Polyhedron> | null {
  if (
    oldProps.points.length !== newProps.points.length ||
    oldProps.faces.length != newProps.faces.length ||
    !pointsArrayEqual(oldProps.points, newProps.points) ||
    !facesArrayEqual(oldProps.faces, newProps.faces)
  ) {
    validateProps(newProps);
    return newProps;
  }
  return null;
}

const defaultPoints: Point[] = [
  [0, 0, 0],
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
const defaultFaces: number[][] = [
  [0, 1, 2],
  [0, 1, 3],
  [0, 2, 3],
  [1, 2, 3],
];

export function commitUpdate(
  instance: CADInstance<Polyhedron>,
  updatePayload: UpdatePayload<Polyhedron>
): void {
  validateProps(updatePayload);
  const { points = defaultPoints, faces = defaultFaces } = updatePayload;
  instance.node.setPointsAndFaces(points, faces);
}
