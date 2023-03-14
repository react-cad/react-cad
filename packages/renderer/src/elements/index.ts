import {
  Element,
  Props,
  Type,
  UpdatePayload,
  Container,
  HostContext,
  ReactCADNodeType,
} from "../types";
import { ReactCADInstance } from "../instance";

import * as box from "./box";
import * as wedge from "./wedge";
import * as cone from "./cone";
import * as cylinder from "./cylinder";
import * as sphere from "./sphere";
import * as torus from "./torus";
import * as polyhedron from "./polyhedron";
import * as solid from "./solid";

import * as helix from "./helix";
import * as prism from "./prism";
import * as evolution from "./evolution";
import * as revolution from "./revolution";
import * as pipe from "./pipe";
import * as loft from "./loft";

import * as affine from "./affine";
import * as rotation from "./rotation";
import * as translation from "./translation";
import * as scale from "./scale";
import * as mirror from "./mirror";

import * as importElement from "./import";

import * as plane from "./plane";
import * as sphericalSurface from "./sphericalSurface";

import * as union from "./union";
import * as difference from "./difference";
import * as intersection from "./intersection";

const elements: Record<ReactCADNodeType, Element> = {
  box,
  wedge,
  cone,
  cylinder,
  sphere,
  torus,
  polyhedron,
  solid,

  helix,
  prism,
  evolution,
  revolution,
  pipe,
  loft,

  affine,
  rotation,
  translation,
  scale,
  mirror,

  brep: importElement,
  step: importElement,
  stl: importElement,
  obj: importElement,

  plane,
  sphericalSurface,

  union,
  difference,
  intersection,
};

export function isReactCADType(t: Type): t is ReactCADNodeType {
  return t in elements;
}

export function prepareUpdate<T extends ReactCADNodeType>(
  _instance: ReactCADInstance<T>,
  type: T,
  oldProps: Props<T>,
  newProps: Props<T>,
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  const element = elements[type];
  if (element) {
    return element.prepareUpdate(oldProps, newProps);
  }
  return null;
}

export function commitUpdate<T extends ReactCADNodeType>(
  instance: ReactCADInstance<T>,
  updatePayload: UpdatePayload<T>,
  type: T
): void {
  const element = elements[type];
  if (element) {
    return element.commitUpdate(instance, updatePayload);
  }
}
