import {
  Element,
  ElementProps,
  Container,
  HostContext,
  Instance,
  Type,
  UpdatePayload,
} from "../types";

import * as box from "./box";
import * as cylinder from "./cylinder";
import * as sphere from "./sphere";
import * as torus from "./torus";

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

  rotation,
  translation,
  scale,

  union,
  difference,
  intersection,
};

export function prepareUpdate<T extends Type>(
  instance: Instance<T>,
  type: T,
  oldProps: ElementProps[T],
  newProps: ElementProps[T],
  rootContainerInstance: Container,
  hostContext: HostContext
): UpdatePayload | null {
  const element = elements[type];
  if (element) {
    return element.prepareUpdate(
      instance,
      type,
      oldProps,
      newProps,
      rootContainerInstance,
      hostContext
    );
  }

  return null;
}
