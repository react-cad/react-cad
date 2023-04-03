import React from "react";
import type { ReactCADCore, ReactCADShape } from "@react-cad/core";

import { useExport, useReactCADView } from "./hooks";
import { ViewOptions, Viewpoint } from "./types";

import Toolbar from "./Toolbar";
import ProgressBar from "./ProgressBar";
import TaskManager from "./TaskManager";

interface Props {
  className?: string;
  core: ReactCADCore;
  taskManager?: TaskManager;
  shape?: ReactCADShape;
  name?: string;
  reset?: boolean;
  focus?: boolean;
  borderless?: boolean;
  highDetail?: [number, number];
  lowDetail?: [number, number];
  setDetail?: (detail: ViewOptions["detail"]) => void;
}

const ReactCADNodeViewer = React.forwardRef<HTMLDivElement | undefined, Props>(
  (
    {
      className,
      core,
      taskManager: existingTaskManager,
      shape,
      name,
      reset,
      focus,
      borderless,
      highDetail = [0.001, 0.5],
      lowDetail = [0.05, 0.5],
      setDetail,
    },
    forwardedRef
  ) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current ?? undefined
    );

    const [options, setOptions] = React.useState<ViewOptions>({
      showAxes: false,
      showGrid: true,
      showWireframe: false,
      showShaded: true,
      projection: "ORTHOGRAPHIC",
      detail: "LOW",
      highDetail,
      lowDetail,
    });

    const taskManager = React.useMemo(
      () => existingTaskManager ?? new TaskManager(core),
      [core, existingTaskManager]
    );

    const canvasContainerRef = React.useRef<HTMLDivElement>(null);

    const view = useReactCADView(canvasContainerRef, core, options);

    const [shouldReset, setShouldReset] = React.useState(reset);
    React.useEffect(() => {
      if (reset) {
        setShouldReset(true);
      }
    }, [reset]);

    React.useEffect(() => {
      if (shape && view.current) {
        console.log("rendering");
        taskManager.render(shape, view.current).then(
          () => {
            if (reset || shouldReset) {
              view.current?.resetView();
              setShouldReset(false);
            }
          },
          () => {}
        );
      }
    }, [shape]);

    React.useEffect(
      () => setOptions((options) => ({ ...options, highDetail, lowDetail })),
      [...highDetail, ...lowDetail]
    );

    React.useEffect(() => {
      setDetail?.(options.detail);
    }, [options.detail]);

    const handleSetViewpoint = React.useCallback((viewpoint: Viewpoint) => {
      view.current?.setViewpoint(core.Viewpoint[viewpoint]);
    }, []);

    const handleZoom = React.useCallback((amount: number) => {
      view.current?.zoom(amount);
    }, []);

    const handleResetView = React.useCallback(() => {
      view.current?.resetView();
    }, []);

    const handleFit = React.useCallback(() => view.current?.fit(), []);

    const exportFns = useExport(taskManager, shape, name);

    return (
      <div
        className={className}
        ref={wrapperRef}
        style={{
          height: "100%",
          width: "100%",
          fontFamily:
            '"Nunito Sans", -apple-system, ".SFNSText-Regular", "San Francisco", BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif',
        }}
      >
        <Toolbar
          options={options}
          setOptions={setOptions}
          exportFns={exportFns}
          onSetViewpoint={handleSetViewpoint}
          onZoom={handleZoom}
          onFit={handleFit}
          onResetView={handleResetView}
          focus={focus}
          borderless={borderless}
        >
          <ProgressBar taskManager={taskManager}>
            <div
              style={{ width: "100%", height: "100%" }}
              ref={canvasContainerRef}
              dangerouslySetInnerHTML={{
                __html: '<canvas style="width: 100%; height: 100%" />',
              }}
            />
          </ProgressBar>
        </Toolbar>
      </div>
    );
  }
);

export default ReactCADNodeViewer;
