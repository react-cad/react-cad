import { ElementProps } from "../../src/types";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ElementProps {
    }
  }
}
