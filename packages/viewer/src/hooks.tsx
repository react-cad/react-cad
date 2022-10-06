import React from "react";
import {
  createRoot,
  ReactCADCore,
  ReactCADView,
  ReactCADNode,
  ProgressIndicator,
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
  canvasRef: React.RefObject<HTMLCanvasElement>,
  core: ReactCADCore,
  options: ViewOptions,
  addTask: AddTask
): [React.MutableRefObject<ReactCADView | undefined>, () => void] {
  const view = React.useRef<ReactCADView>();
  const [onResize, setOnResize] = React.useState(() => () => {});

  React.useEffect(() => {
    if (canvasRef.current) {
      view.current = core.createView(canvasRef.current);
      setOnResize(() => () => {
        if (view.current && canvasRef.current) {
          canvasRef.current.width =
            canvasRef.current.clientWidth * window.devicePixelRatio;
          canvasRef.current.height =
            canvasRef.current.clientHeight * window.devicePixelRatio;
          view.current.onResize();
        }
      });
      return () => {
        if (view.current) {
          view.current.delete();
          view.current = undefined;
        }
      };
    }
  }, []);

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
    }
  }, [
    onResize,
    options.showAxes,
    options.showGrid,
    options.showShaded,
    options.showWireframe,
    options.projection,
  ]);

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const quality =
      options.detail === "HIGH" ? options.highDetail : options.lowDetail;
    if (loaded) {
      addTask(
        () => view.current && core.setRenderQuality(view.current, ...quality)
      );
    } else {
      view.current?.setQuality(...quality);
    }
    setLoaded(true);
  }, [options.detail, ...options.highDetail, ...options.lowDetail]);

  return [view, onResize];
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
  core: ReactCADCore,
  addTask: AddTask,
  node: ReactCADNode,
  name: string | undefined
): ExportFns {
  const linearDeflection = 0.05;
  const angularDeflection = 0.5;

  const exportBREP = React.useCallback(
    () =>
      addTask(() => {
        const progress = core.renderBREP(node);

        progress.then(
          (content) =>
            content &&
            download(content, `${name || "react-cad"}.brep`, "model/brep")
        );

        return progress;
      }, false),
    [core, addTask, node, name]
  );

  const exportSTEP = React.useCallback(
    () =>
      addTask(() => {
        const progress = core.renderSTEP(node);

        progress.then(
          (content) =>
            content &&
            download(content, `${name || "react-cad"}.step`, "model/step")
        );

        return progress;
      }, false),
    [core, addTask, node, name]
  );

  const exportSTL = React.useCallback(
    () =>
      addTask(() => {
        const progress = core.renderSTL(
          node,
          linearDeflection,
          angularDeflection
        );

        progress.then(
          (content) =>
            content &&
            download(content, `${name || "react-cad"}.stl`, "model/stl")
        );

        return progress;
      }, false),
    [core, node, addTask, name]
  );

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

type Task = () => ProgressIndicator<any> | undefined;

type AddTask = (task: Task, cancelPrevious?: boolean) => Promise<void>;

type QueueItem = [Task, () => void];

export function useProgressQueue(): [
  ProgressIndicator<any> | undefined,
  AddTask,
  number
] {
  const [progressIndicator, setProgressIndicator] = React.useState<
    ProgressIndicator<any>
  >();

  const queue = React.useRef<QueueItem[]>([]);

  const [queueLength, setQueueLength] = React.useState(0);

  const then = React.useCallback(() => {
    let progress: ProgressIndicator | undefined;
    let resolve: undefined | (() => void);

    do {
      const [task, r] = queue.current.shift() ?? [];
      progress = task?.();
      if (!progress) {
        r?.();
      } else {
        resolve = r;
      }
    } while (queue.current.length && !progress);

    setQueueLength(queue.current.length);

    progress?.then(then, () => {}).then(resolve);

    if (progress) {
      setProgressIndicator((p) => {
        p?.delete();
        return progress;
      });
    }

    return progress;
  }, [queue]);

  const addTask = React.useCallback<AddTask>(
    (task, cancelPrevious = true) => {
      const queueItem: QueueItem = [task, () => {}];
      const promise = new Promise<void>((resolve) => (queueItem[1] = resolve));
      if (
        !progressIndicator ||
        progressIndicator.isDeleted() ||
        progressIndicator.isFulfilled()
      ) {
        queue.current.push(queueItem);
        then();
      } else {
        if (cancelPrevious) {
          queue.current.forEach(([, resolve]) => resolve());
          queue.current = [queueItem];
          progressIndicator.catch(then).catch(() => {});
          progressIndicator.cancel();
        } else {
          queue.current.push(queueItem);
          setQueueLength(queue.current.length);
        }
      }
      return promise;
    },
    [progressIndicator, then]
  );

  return [progressIndicator, addTask, queueLength];
}
