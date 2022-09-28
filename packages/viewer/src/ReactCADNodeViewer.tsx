import React from "react";
import { ReactCADCore, ReactCADNode } from "react-cad";

import { useExport, useReactCADView } from "./hooks";
import { ViewOptions, Viewpoint } from "./types";

import Toolbar from "./Toolbar";

interface Props {
  className?: string;
  core: ReactCADCore;
  node: ReactCADNode;
  name?: string;
  reset?: boolean;
  focus?: boolean;
  resizable?: boolean;
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
      resizable,
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

    const [view, canvasRef, onResize] = useReactCADView(core, options);

    React.useEffect(() => {
      if (view.current) {
        core.renderNodeAsync(node, view.current).then(() => {
          if (reset) {
            view.current?.resetView();
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

    const handleDownload = useExport(node, core, name);

    return (
      <div
        className={className}
        ref={wrapperRef}
        style={{ height: "100%", width: "100%" }}
      >
        <Toolbar
          options={options}
          setOptions={setOptions}
          onDownload={handleDownload}
          onSetViewpoint={handleSetViewpoint}
          onZoom={handleZoom}
          onFit={handleFit}
          onResetView={handleResetView}
          focus={focus}
          onResize={resizable ? onResize : undefined}
        >
          <canvas style={{ width: "100%", height: "100%" }} ref={canvasRef} />
        </Toolbar>
      </div>
    );
  }
);

export default ReactCADViewer;
