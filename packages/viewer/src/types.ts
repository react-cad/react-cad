export type Projection = "ORTHOGRAPHIC" | "PERSPECTIVE";
export type Detail = "HIGH" | "LOW";

export type DetailSettings = [number, number];

export interface ViewOptions {
  showAxes: boolean;
  showGrid: boolean;
  showWireframe: boolean;
  showShaded: boolean;
  projection: Projection;
  detail: Detail;
  highDetail: DetailSettings;
  lowDetail: DetailSettings;
}

export type Viewpoint = "TOP" | "BOTTOM" | "LEFT" | "RIGHT" | "FRONT" | "BACK";
