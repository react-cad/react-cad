import React from "react";
import {
  createRoot,
  ReactCADCore,
  ReactCADView,
  ReactCADNode,
} from "react-cad";
import { ExportFns, ViewOptions } from "./types";

import DetailContext from "./DetailContext";
import CADErrorBoundary from "./CADErrorBoundary";

export function useReactCADRenderer(
  core: ReactCADCore,
  shape: React.ReactElement,
  detail: ViewOptions["detail"],
  reset?: boolean
): [ReactCADNode, number, boolean, unknown | undefined] {
  const rootNode = React.useMemo(() => core.createCADNode("union"), [core]);
  const root = React.useMemo(() => createRoot(rootNode, core), [core]);

  const [renderFrameId, setRenderFrameId] = React.useState(0);
  const [renderReset, setRenderReset] = React.useState(false);
  const [renderError, setRenderError] = React.useState<unknown>();

  const renderCallback = React.useMemo(() => {
    let shouldReset = Boolean(reset);

    return async () => {
      setRenderReset(shouldReset);
      setRenderFrameId((n) => n + 1);

      shouldReset = false;
    };
  }, [core, rootNode, reset]);

  React.useEffect(() => {
    root.render(
      <CADErrorBoundary shape={shape} log={setRenderError}>
        <DetailContext.Provider value={detail}>{shape}</DetailContext.Provider>
      </CADErrorBoundary>,
      renderCallback
    );

    return () => setRenderError(undefined);
  }, [shape, detail, root, rootNode]);

  React.useEffect(() => {
    if (renderError) {
      console.error(renderError);
    }
  }, [renderError]);

  React.useEffect(
    () => () => {
      root.delete();
      rootNode.delete();
    },
    []
  );

  return [rootNode, renderFrameId, renderReset, renderError];
}

export function useReactCADView(
  core: ReactCADCore,
  options: ViewOptions
): [
  React.MutableRefObject<ReactCADView | undefined>,
  (canvas: HTMLCanvasElement | null) => void,
  () => void
] {
  const view = React.useRef<ReactCADView>();
  const [onResize, setOnResize] = React.useState(() => () => {});

  const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
    if (canvas) {
      if (view.current) {
        view.current.delete();
        view.current = undefined;
      }
      view.current = core.createView(canvas);
      setOnResize(() => () => {
        if (view.current) {
          canvas.width = canvas.clientWidth * window.devicePixelRatio;
          canvas.height = canvas.clientHeight * window.devicePixelRatio;
          view.current.onResize();
        }
      });
    }
  }, []);

  React.useEffect(
    () => () => {
      if (view.current) {
        view.current.delete();
        view.current = undefined;
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

function download(
  content: string | ArrayBuffer,
  name: string,
  mimetype: string
) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mimetype }));
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

export function useExport(
  node: ReactCADNode,
  core: ReactCADCore,
  name: string | undefined
): ExportFns {
  const linearDeflection = 0.05;
  const isRelative = false;
  const angularDeflection = 0.5;

  const exportBREP = React.useCallback(async () => {
    const content = await core.renderBREP(node);

    if (content) {
      download(content, `${name || "react-cad"}.brep`, "model/brep");
    }
  }, [node, core, name]);

  const exportSTEP = React.useCallback(async () => {
    const content = await core.renderSTEP(node);

    if (content) {
      download(content, `${name || "react-cad"}.step`, "model/step");
    }
  }, [node, core, name]);

  const exportSTL = React.useCallback(async () => {
    const content = await core.renderSTL(
      node,
      linearDeflection,
      isRelative,
      angularDeflection
    );

    if (content) {
      download(content, `${name || "react-cad"}.stl`, "model/stl");
    }
  }, [node, core, name]);

  return { exportSTL, exportBREP, exportSTEP };
}

export function useClickOutside(
  callback: () => void
): React.RefObject<HTMLDivElement> {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  return wrapperRef;
}
