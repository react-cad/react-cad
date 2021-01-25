import { Fiber } from "react-reconciler";
import { ReactCADCore, ReactCADNode } from "@react-cad/core";

export interface Element {
  prepareUpdate(
    instance: Instance<Type>,
    type: Type,
    oldProps: ElementProps[Type],
    newProps: ElementProps[Type],
    rootContainerInstance: Container,
    hostContext: HostContext
  ): UpdatePayload | null;
}

export interface ReactCADElements {
  box: {
    x: number;
    y: number;
    z: number;
  };
  cylinder: {
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
  helix: {
    radius: number;
    height: number;
  };

  rotation: React.PropsWithChildren<{
    axis: "x" | "y" | "z";
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
  nodes: ReactCADNode[];
  rootNodes: ReactCADNode[];
};

export type HostContext = unknown;
export type Type = keyof ElementProps;
export type Props = ElementProps[keyof ElementProps];
export interface Instance<T extends Type = Type> {
  type: T;
  node: ReactCADNode;
}
export type TextInstance = Instance;
export type HydratableInstance = never;
export type PublicInstance = ReactCADNode;
export type UpdatePayload = Props;

export type ChildSet = never;
export type InstanceHandle = Fiber;
