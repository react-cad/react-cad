import { Fiber } from "react-reconciler";
import {
  ReactCADCore,
  ReactCADNode,
  Axis,
  Polygon,
  Profile,
  Point,
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
  };
  polyhedron: {
    points: Point[];
    faces: number[][];
  };

  prism: {
    profile: Profile;
    axis: Axis;
    height: number;
  };
  revolution: {
    profile: Polygon;
    axis: Axis;
    angle: number;
  };
  helix: {
    profile: Profile;
    pitch: number;
    height: number;
  };

  rotation: React.PropsWithChildren<{
    axis: Axis;
    angle: number;
  }>;
  translation: React.PropsWithChildren<{
    x: number;
    y: number;
    z: number;
  }>;
  scale: React.PropsWithChildren<{
    factor: number;
  }>;

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
  type: T;
  node: ReactCADNode;
}
export type TextInstance = Instance;
export type HydratableInstance = never;
export type PublicInstance = ReactCADNode;
export type UpdatePayload<T extends Type = Type> = Props<T>;

export type ChildSet = never;
export type InstanceHandle = Fiber;
