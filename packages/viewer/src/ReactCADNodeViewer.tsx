import React from "react";
import type { ReactCADCore, ReactCADNode } from "@react-cad/core";

import { useExport, useProgressQueue, useReactCADView } from "./hooks";
import { ViewOptions, Viewpoint } from "./types";

import Toolbar from "./Toolbar";
import ProgressBar from "./ProgressBar";

interface Props {
  className?: string;
  core: ReactCADCore;
  node: ReactCADNode;
  name?: string;
  reset?: boolean;
  focus?: boolean;
  borderless?: boolean;
  highDetail?: [number, number];
  lowDetail?: [number, number];
  setDetail?: (detail: ViewOptions["detail"]) => void;
  rerender?: any;
}

const ReactCADViewer = React.forwardRef<HTMLDivElement | undefined, Props>(
  (
    {
      className,
      core,
      node,
      name,
      reset,
      focus,
      borderless,
      highDetail = [0.001, 0.5],
      lowDetail = [0.002, 1],
      setDetail,
      rerender,
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

    const [progressIndicator, addTask, queuedTasks] = useProgressQueue();

    const canvasContainerRef = React.useRef<HTMLDivElement>(null);

    const view = useReactCADView(canvasContainerRef, core, options, addTask);

    const shouldReset = React.useRef(false);

    React.useEffect(() => {
      if (rerender) {
        addTask(() => {
          if (view.current) {
            const progress = core.renderNodeAsync(node, view.current);

            progress.then(
              () => {
                if (reset || shouldReset.current) {
                  view.current?.resetView();
                  shouldReset.current = false;
                }
              },
              () => {
                shouldReset.current = Boolean(reset || shouldReset.current);
              }
            );

            return progress;
          }
        });
      }
    }, [node, rerender]);

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

    const exportFns = useExport(core, addTask, node, name);

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
          <ProgressBar
            progressIndicator={progressIndicator}
            queuedTasks={queuedTasks}
          >
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

export default ReactCADViewer;
