import { ElementProps } from "../../lib/types";

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IntrinsicElements extends ElementProps {}
  }
}
