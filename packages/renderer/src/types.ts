import { Fiber } from "react-reconciler";
import {
  ReactCADCore,
  ReactCADNode,
  Polygon,
  Profile,
  Point,
  ReactCADNodeTypes,
  AxisName,
  Vector,
  Quaternion,
  Matrix,
} from "@react-cad/core";

export interface Element<T extends Type = Type> {
  prepareUpdate(
    oldProps: Props<T>,
    newProps: Props<T>
  ): UpdatePayload<T> | null;
  commitUpdate(instance: Instance<T>, updatePayload: UpdatePayload<T>): void;
}

export interface ReactCADElements {
  box: {
    center?: boolean;
    x: number;
    y: number;
    z: number;
  };
  wedge:
    | {
        x: number;
        y: number;
        z: number;
        ltx: number;
      }
    | {
        x: number;
        y: number;
        z: number;
        xmin: number;
        xmax: number;
        zmin: number;
        zmax: number;
      };
  cone: {
    center?: boolean;
    radius1: number;
    radius2: number;
    height: number;
    angle?: number;
  };
  cylinder: {
    center?: boolean;
    radius: number;
    height: number;
    angle?: number;
  };
  sphere: {
    radius: number;
    angle?: number;
    segmentAngle1?: number;
    segmentAngle2?: number;
  };
  torus: {
    radius1: number;
    radius2: number;
    angle?: number;
  };
  polyhedron: {
    points: Point[];
    faces: number[][];
  };

  evolution: {
    profile: Profile;
    spine: Point[] | string;
  };
  prism: {
    profile: Profile;
    axis: AxisName;
    height: number;
  };
  revolution: {
    profile: Polygon;
    axis: AxisName;
    angle: number;
  };
  helix: {
    profile: Profile;
    pitch: number;
    height: number;
  };

  affine: React.PropsWithChildren<{
    matrix: Matrix;
  }>;
  rotation: React.PropsWithChildren<
    | {
        axis: Vector;
        angle: number;
      }
    | {
        x?: number;
        y?: number;
        z?: number;
      }
    | { quaternion: Quaternion }
  >;
  translation: React.PropsWithChildren<{
    x?: number;
    y?: number;
    z?: number;
  }>;
  scale: React.PropsWithChildren<
    { center?: Point } & (
      | {
          factor: number;
        }
      | { x?: number; y?: number; z?: number }
    )
  >;
  mirror: React.PropsWithChildren<{
    origin: Point;
    normal: Vector;
  }>;

  brep: {
    data: string | ArrayBuffer;
  };
  obj: {
    data: string | ArrayBuffer;
  };
  step: {
    data: string | ArrayBuffer;
  };
  stl: {
    data: string | ArrayBuffer;
  };

  union: React.PropsWithChildren<unknown>;
  difference: React.PropsWithChildren<unknown>;
  intersection: React.PropsWithChildren<unknown>;
}

export type ElementProps = ReactCADElements;

export type Container = {
  core: ReactCADCore;
  root: ReactCADNode;
  nodes: ReactCADNode[];
  rootNodes: ReactCADNode[];
  reset: boolean;
};

export type HostContext = unknown;
export type Type = keyof ElementProps;
export type Props<T extends Type = Type> = ElementProps[T];
export interface Instance<T extends Type = Type> {
  core: ReactCADCore;
  type: T;
  node: ReactCADNodeTypes[T];
}
export type TextInstance = Instance;
export type HydratableInstance = never;
export type PublicInstance = ReactCADNode;
export type UpdatePayload<T extends Type = Type> = Props<T>;

export type ChildSet = never;
export type InstanceHandle = Fiber;
