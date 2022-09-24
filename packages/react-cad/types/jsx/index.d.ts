import { ElementProps } from "@react-cad/renderer";

declare global {
  namespace JSX {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IntrinsicElements extends ElementProps {}
  }
}
