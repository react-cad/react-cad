import {
  ElementProps,
  Container,
  HostContext,
  Instance,
  UpdatePayload,
} from "../types";

type Difference = "difference";

export function prepareUpdate(
  _instance: Instance<Difference>,
  _type: Difference,
  _oldProps: ElementProps[Difference],
  _newProps: ElementProps[Difference],
  _rootContainerInstance: Container,
  _hostContext: HostContext
): UpdatePayload | null {
  return null;
}
