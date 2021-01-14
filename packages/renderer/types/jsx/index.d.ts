import { ElementProps } from "../../src/types";

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export type IntrinsicElements = ElementProps;
  }
}
