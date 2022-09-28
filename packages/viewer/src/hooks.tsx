import React from "react";
import {
  createRoot,
  ReactCADCore,
  ReactCADView,
  ReactCADNode,
} from "react-cad";
import { ViewOptions } from "./types";

import DetailContext from "./DetailContext";

export function useReactCADRenderer(
  core: ReactCADCore,
  shape: React.ReactElement,
  detail: ViewOptions["detail"],
  reset?: boolean
): [ReactCADNode, number, boolean] {
  const rootNode = React.useMemo(() => core.createCADNode("union"), [core]);
  const root = React.useMemo(() => createRoot(rootNode, core), [core]);

  const [renderFrameId, setRenderFrameId] = React.useState(0);
  const [renderReset, setRenderReset] = React.useState(false);

  const renderCallback = React.useMemo(() => {
    let shouldReset = Boolean(reset);

    return async () => {
      await core.computeNodeAsync(rootNode);

      setRenderReset(shouldReset);
      setRenderFrameId((n) => n + 1);

      shouldReset = false;
    };
  }, [core, rootNode, reset]);

  React.useEffect(() => {
    root.render(
      <DetailContext.Provider value={detail}>{shape}</DetailContext.Provider>,
      renderCallback
    );
  }, [shape, detail, root, rootNode]);

  React.useEffect(
    () => () => {
      root.delete();
      rootNode.delete();
    },
    []
  );

  return [rootNode, renderFrameId, renderReset];
}

export function useReactCADView(
  core: ReactCADCore,
  options: ViewOptions
): [
  React.MutableRefObject<ReactCADView | undefined>,
  (canvas: HTMLCanvasElement | null) => void,
  () => void
] {
  const view = React.useRef<ReactCADView & { deleted?: boolean }>();
  const [onResize, setOnResize] = React.useState(() => () => {});

  const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      if (view.current) {
        view.current.delete();
        view.current.deleted = true;
      }
      view.current = core.createView(canvas);
      view.current.deleted = false;
      setOnResize(() => () => {
        if (!view.current?.deleted) {
          canvas.width = canvas.clientWidth * window.devicePixelRatio;
          canvas.height = canvas.clientHeight * window.devicePixelRatio;
          view.current?.onResize();
        }
      });
    }
  }, []);

  React.useEffect(
    () => () => {
      if (view.current && !view.current.deleted) {
        view.current.delete();
      }
    },
    []
  );

  React.useEffect(() => {
    if (onResize) {
      onResize();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }
  }, [onResize]);

  React.useEffect(() => {
    if (view.current) {
      view.current.showAxes(options.showAxes);
      view.current.showGrid(options.showGrid);
      view.current.showWireframe(options.showWireframe);
      view.current.showShaded(options.showShaded);
      view.current.setProjection(core.Projection[options.projection]);
      const quality =
        options.detail === "HIGH" ? options.highDetail : options.lowDetail;
      view.current.setQuality(...quality);
    }
  }, [
    onResize,
    options.showAxes,
    options.showGrid,
    options.showShaded,
    options.showWireframe,
    options.projection,
    options.detail,
    ...options.highDetail,
    ...options.lowDetail,
  ]);

  return [view, canvasRef, onResize];
}

export function useExport(
  node: ReactCADNode,
  core: ReactCADCore,
  name: string | undefined
): (event: React.SyntheticEvent) => void {
  const linearDeflection = 0.05;
  const isRelative = false;
  const angularDeflection = 0.5;
  return React.useCallback(
    async (event: React.SyntheticEvent) => {
      event.preventDefault();

      const content = core.renderSTL(
        node,
        linearDeflection,
        isRelative,
        angularDeflection
      );

      if (content) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(
          new Blob([content], { type: "model/stl" })
        );
        a.download = `${name || "react-cad"}.stl`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(a.href);
        document.body.removeChild(a);
      }
    },
    [node, core, name]
  );
}
