import { ElementProps } from "../../src/types";

declare global {
  namespace JSX {
    export interface IntrinsicElements extends ElementProps {
    }
  }
}
