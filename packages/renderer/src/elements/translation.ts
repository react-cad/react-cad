import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Translation = "translation";

export function prepareUpdate(
  _instance: Instance<Translation>,
  _type: Translation,
  oldProps: ElementProps[Translation],
  newProps: ElementProps[Translation],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  if (
    oldProps.x !== newProps.x ||
    oldProps.y !== newProps.y ||
    oldProps.z !== newProps.z
  ) {
    return newProps;
  }
  return null;
}
