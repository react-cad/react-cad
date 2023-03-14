import { Fiber } from "react-reconciler";
import {
  ReactCADCore,
  ReactCADNode,
  Point,
  Vector,
  Quaternion,
  Matrix,
} from "@react-cad/core";
import { ReactCADInstance, SVGInstance } from "instance";

export interface Element<T extends ReactCADNodeType = ReactCADNodeType> {
  prepareUpdate(
    oldProps: Props<ReactCADNodeType>,
    newProps: Props<ReactCADNodeType>
  ): UpdatePayload<T> | null;
  commitUpdate(
    instance: ReactCADInstance<T>,
    updatePayload: UpdatePayload<T>
  ): void;
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

  evolution: React.PropsWithChildren<{
    profile: string;
  }>;
  pipe: React.PropsWithChildren<{
    spine: string;
  }>;
  prism: React.PropsWithChildren<
    | {
        x?: number;
        y?: number;
        z?: number;
      }
    | {
        vector: Vector;
      }
  >;
  revolution: React.PropsWithChildren<{
    axis: Vector;
    angle: number;
  }>;
  helix: React.PropsWithChildren<{
    pitch: number;
    height: number;
    leftHanded?: boolean;
  }>;
  loft: React.PropsWithChildren<{
    compatible?: boolean;
    smooth?: boolean;
  }>;

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
  translation: React.PropsWithChildren<
    | {
        x?: number;
        y?: number;
        z?: number;
      }
    | {
        vector: Vector;
      }
  >;
  scale: React.PropsWithChildren<
    { center?: Point } & (
      | {
          factor: number;
        }
      | { x?: number; y?: number; z?: number }
    )
  >;
  mirror: React.PropsWithChildren<{
    point?: Point;
    normal?: Vector;
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

  surface: React.PropsWithChildren<
    {
      origin?: Point;
    } & (
      | { normal?: never; xDirection?: never }
      | {
          normal: number[];
          xDirection: number[];
        }
    )
  >;

  union: React.PropsWithChildren<unknown>;
  difference: React.PropsWithChildren<unknown>;
  intersection: React.PropsWithChildren<unknown>;
}

export type ElementProps = ReactCADElements;

export type Container = {
  core: ReactCADCore;
  root: Instance;
  instances: Instance[];
  rootInstances: Instance[];
  callback?: () => void;
};

export type HostContext = unknown;

export type ReactCADNodeType = keyof ElementProps;
export type SVGNodeType = keyof JSX.IntrinsicElements;
export type Type = ReactCADNodeType | SVGNodeType;
export type Props<T extends Type = Type> = T extends SVGNodeType
  ? JSX.IntrinsicElements[T]
  : T extends ReactCADNodeType
  ? ElementProps[T]
  : never;
export type Instance = SVGInstance | ReactCADInstance;

export type TextInstance = string;
export type HydratableInstance = never;
export type PublicInstance = ReactCADNode | SVGElement;
export type UpdatePayload<T extends Type = Type> = Props<T>;

export type ChildSet = never;
export type InstanceHandle = Fiber;
