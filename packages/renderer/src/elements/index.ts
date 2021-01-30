import { Element, Props, Instance, Type, UpdatePayload } from "../types";

import * as box from "./box";
import * as cylinder from "./cylinder";
import * as sphere from "./sphere";
import * as torus from "./torus";

import * as helix from "./helix";

import * as rotation from "./rotation";
import * as translation from "./translation";
import * as scale from "./scale";

import * as union from "./union";
import * as difference from "./difference";
import * as intersection from "./intersection";

const elements: Record<Type, Element> = {
  box,
  cylinder,
  sphere,
  torus,

  helix,

  rotation,
  translation,
  scale,

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
  updatePayload: UpdatePayload,
  type: T
): void {
  const element = elements[type];
  if (element) {
    return element.commitUpdate(instance, updatePayload);
  }
}
