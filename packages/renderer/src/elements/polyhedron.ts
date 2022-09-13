import { ReactCADPolyhedronNode, Point } from "@react-cad/core";
import { Props, Instance, UpdatePayload } from "../types";

type Polyhedron = "polyhedron";

function validateProps(props: Props<Polyhedron>): boolean {
  if (props.points.length < 4) {
    throw new Error(
      `polyhedron: "points" prop must be contain at least 4 points`
    );
  }
  if (props.faces.length < 4) {
    throw new Error(
      `polyhedron: "faces" prop must be contain at least 4 faces`
    );
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

function arrayEqual(a: number[], b: number[]) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
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
  instance: Instance<Polyhedron>,
  updatePayload: UpdatePayload<Polyhedron>
): void {
  const { points = defaultPoints, faces = defaultFaces } = updatePayload;
  const polyhedron = instance.node as ReactCADPolyhedronNode;
  polyhedron.setPointsAndFaces(points, faces);
}
