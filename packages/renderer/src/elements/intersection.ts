import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Intersection = "intersection";

export function prepareUpdate(
  _instance: Instance<Intersection>,
  _type: Intersection,
  _oldProps: ElementProps[Intersection],
  _newProps: ElementProps[Intersection],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  return null;
}
