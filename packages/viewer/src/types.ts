export interface ViewOptions {
  showAxes: boolean;
  showGrid: boolean;
  showWireframe: boolean;
  showShaded: boolean;
  projection: "ORTHOGRAPHIC" | "PERSPECTIVE";
}

export type Viewpoint = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "FRONT" | "BACK";
