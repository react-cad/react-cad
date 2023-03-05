import React from "react";
import type { ReactCADCore, ReactCADView } from "@react-cad/core";
import { ViewOptions } from "../types";

import { AddTask } from "./useProgressQueue";

function useReactCADView(
  canvasContainerRef: React.RefObject<HTMLDivElement>,
  core: ReactCADCore,
  options: ViewOptions,
  addTask: AddTask
): React.MutableRefObject<ReactCADView | undefined> {
  const canvasRef = React.useRef<HTMLCanvasElement>();
  const view = React.useRef<ReactCADView>();
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    canvasRef.current = canvasContainerRef.current?.getElementsByTagName(
      "canvas"
    )[0];
    if (canvasRef.current) {
      view.current = core.createView(canvasRef.current);

      const onResize = () => {
        if (view.current && canvasRef.current) {
          canvasRef.current.width =
            canvasRef.current.clientWidth * window.devicePixelRatio;
          canvasRef.current.height =
            canvasRef.current.clientHeight * window.devicePixelRatio;
          view.current.onResize();
        }
      };

      const observer = new ResizeObserver(onResize);
      observer.observe(canvasRef.current, {});

      const quality =
        options.detail === "HIGH" ? options.highDetail : options.lowDetail;
      view.current?.setQuality(...quality);

      setLoaded(true);

      return () => {
        observer.disconnect();
        if (canvasContainerRef.current) {
          canvasContainerRef.current.innerHTML = "";
          canvasRef.current = undefined;
        }
        if (view.current) {
          view.current.delete();
          view.current = undefined;
        }
      };
    }
  }, []);

  React.useEffect(() => {
    if (view.current) {
      view.current.showAxes(options.showAxes);
      view.current.showGrid(options.showGrid);
      view.current.showWireframe(options.showWireframe);
      view.current.showShaded(options.showShaded);
      view.current.setProjection(core.Projection[options.projection]);
    }
  }, [
    loaded,
    options.showAxes,
    options.showGrid,
    options.showShaded,
    options.showWireframe,
    options.projection,
  ]);

  React.useEffect(() => {
    if (loaded) {
      const quality =
        options.detail === "HIGH" ? options.highDetail : options.lowDetail;
      addTask(
        () => view.current && core.setRenderQuality(view.current, ...quality)
      );
    }
  }, [options.detail, ...options.highDetail, ...options.lowDetail]);

  return view;
}

export default useReactCADView;
