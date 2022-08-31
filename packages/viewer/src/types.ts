export type Projection = "ORTHOGRAPHIC" | "PERSPECTIVE";
export type Detail = "HIGH" | "LOW";

export interface ViewOptions {
  showAxes: boolean;
  showGrid: boolean;
  showWireframe: boolean;
  showShaded: boolean;
  projection: Projection;
  detail: Detail;
}

export type Viewpoint = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "FRONT" | "BACK";
