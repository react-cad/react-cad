import { Fiber } from "react-reconciler";
import { ReactCADCore, ReactCADNode, Axis, Point } from "@react-cad/core";

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
  };
  sphere: {
    radius: number;
  };
  torus: {
    radius1: number;
    radius2: number;
  };

  prism: {
    profile: Point[];
    axis: Axis;
    height: number;
  };
  revolution: {
    profile: Point[];
    axis: Axis;
    angle: number;
  };
  helix: {
    profile: Point[];
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
