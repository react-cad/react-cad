import { Fiber } from "react-reconciler";
import { ReactCadCoreModule, Shape, Transform } from "@react-cad/core";

export interface Element {
  createInstance(
    type: Type,
    props: ElementProps[Type],
    rootContainerInstance: Container,
    hostContext: HostContext,
    internalInstanceHandle: InstanceHandle
  ): Instance<Type>;
  destroyInstance(instance: Instance<Type>): void;
  hasChildren: boolean;
  skipChildUnion?: boolean;
  commitChildren(parentInstance: Instance<Type>): void;
  prepareUpdate(
    instance: Instance<Type>,
    type: Type,
    oldProps: ElementProps[Type],
    newProps: ElementProps[Type],
    rootContainerInstance: Container,
    hostContext: HostContext
  ): UpdatePayload | null;
  commitUpdate(
    instance: Instance<Type>,
    updatePayload: UpdatePayload,
    type: Type,
    oldProps: ElementProps[Type],
    newProps: ElementProps[Type],
    internalInstanceHandle: InstanceHandle
  ): void;
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

export interface ElementData {
  box: undefined;
  cylinder: undefined;
  sphere: undefined;
  torus: undefined;

  rotation: {
    transform: Transform;
  };
  translation: {
    transform: Transform;
  };
  scale: {
    transform: Transform;
  };

  union: undefined;
  difference: undefined;
  intersection: undefined;
}

export type Container = ReactCadCoreModule & {
  children?: Instance[];
  childShape?: Shape;
};
export type HostContext = { nullShape(): Shape };
export type Type = keyof ElementProps;
export type Props = ElementProps[keyof ElementProps];
export interface Instance<T extends Type = Type> {
  type: T;
  shape: Shape;
  data: ElementData[T];
  notifyParent?: () => void;
  children: Instance[];
  childShape?: Shape;
  rootContainerInstance: Container;
  hostContext: HostContext;
}
export type TextInstance = Instance;
export type HydratableInstance = never;
export type PublicInstance = Shape;
export interface UpdatePayload {
  rootContainerInstance: Container;
  hostContext: HostContext;
}
export type ChildSet = never;
export type InstanceHandle = Fiber;
