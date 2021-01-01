export namespace ReactCad {
  export interface Props {
    box: {
      x: number;
      y: number;
      z: number;
    };
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements extends ReactCad.Props {
    }
  }
}
