import { Element, Props, Instance, Type, UpdatePayload } from "../types";

import * as box from "./box";
import * as wedge from "./wedge";
import * as cone from "./cone";
import * as cylinder from "./cylinder";
import * as sphere from "./sphere";
import * as torus from "./torus";
import * as polyhedron from "./polyhedron";

import * as helix from "./helix";
import * as prism from "./prism";
import * as revolution from "./revolution";

import * as rotation from "./rotation";
import * as translation from "./translation";
import * as scale from "./scale";

import * as step from "./step";

import * as union from "./union";
import * as difference from "./difference";
import * as intersection from "./intersection";

const elements: Record<Type, Element> = {
  box,
  wedge,
  cone,
  cylinder,
  sphere,
  torus,
  polyhedron,

  helix,
  prism,
  revolution,

  rotation,
  translation,
  scale,

  step,

  union,
  difference,
  intersection,
};

export function prepareUpdate<T extends Type>(
  _instance: Instance<T>,
  type: T,
  oldProps: Props<T>,
  newProps: Props<T>
): UpdatePayload | null {
  const element = elements[type];
  if (element) {
    return element.prepareUpdate(oldProps, newProps);
  }
  return null;
}

export function commitUpdate<T extends Type>(
  instance: Instance<T>,
  updatePayload: UpdatePayload<T>,
  type: T
): void {
  const element = elements[type];
  if (element) {
    return element.commitUpdate(instance, updatePayload);
  }
}
