import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Union = "union";

export function prepareUpdate(
  _instance: Instance<Union>,
  _type: Union,
  _oldProps: ElementProps[Union],
  _newProps: ElementProps[Union],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  return null;
}
