import { Fiber } from "react-reconciler";
import { ReactCadCoreModule, ReactCADNode } from "@react-cad/core";

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

export interface ElementProps {
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

  rotation: {
    axis: "x" | "y" | "z";
    angle: number;
    children?: React.ReactNode;
  };
  translation: {
    x: number;
    y: number;
    z: number;
  };
  scale: {
    factor: number;
  };

  union: {
    children?: React.ReactNode;
  };
  difference: {
    children?: React.ReactNode;
  };
  intersection: {
    children?: React.ReactNode;
  };
}

export type Container = {
  core: ReactCadCoreModule;
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
