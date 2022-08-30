import React from "react";
import ReactCadRenderer from "@react-cad/renderer";

import { useReactCadCore, useReactCadRenderer } from "./hooks";
import { ViewOptions, Viewpoint } from "./types";

import Toolbar from "./Toolbar";

interface Props {
  className?: string;
  coreUrl: string;
  shape: React.ReactElement<unknown>;
  name?: string;
  reset?: boolean;
  focus?: boolean;
}

const ReactCadViewer = React.forwardRef<HTMLDivElement | undefined, Props>(
  ({ className, coreUrl, shape, name, reset, focus }, forwardedRef) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current ?? undefined
    );

    const [options, setOptions] = React.useState<ViewOptions>({
      showAxes: false,
      showGrid: true,
      showWireframe: true,
      showShaded: true,
      projection: "ORTHOGRAPHIC",
    });

    const [core, loaded, canvasRef] = useReactCadCore(coreUrl);
    useReactCadRenderer(core, loaded, shape, reset);

    React.useEffect(() => {
      core.current?.showAxes(options.showAxes);
      core.current?.showGrid(options.showGrid);
      core.current?.showWireframe(options.showWireframe);
      core.current?.showShaded(options.showShaded);
      core.current?.setProjection(core.current.Projection[options.projection]);
    }, [loaded, options]);

    const handleSetViewpoint = React.useCallback(
      (viewpoint: Viewpoint) =>
        core.current?.setViewpoint(core.current.Viewpoint[viewpoint]),
      []
    );

    const handleZoom = React.useCallback(
      (amount: number) => core.current?.zoom(amount),
      []
    );

    const handleResetView = React.useCallback(
      () => core.current?.resetView(),
      []
    );
    const handleFit = React.useCallback(() => core.current?.fit(), []);

    const handleDownload = React.useCallback(
      async (event: React.SyntheticEvent) => {
        event.preventDefault();
        const content = await (core.current
          ? ReactCadRenderer.renderToSTL(shape, core.current, 0.05, false, 0.5)
          : Promise.reject("react-cad not initialised"));

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
      },
      [shape, name]
    );

    return (
      <div className={className} ref={wrapperRef}>
        <Toolbar
          options={options}
          setOptions={setOptions}
          onDownload={handleDownload}
          onSetViewpoint={handleSetViewpoint}
          onZoom={handleZoom}
          onFit={handleFit}
          onResetView={handleResetView}
          focus={focus}
        >
          <canvas style={{ width: "100%", height: "100%" }} ref={canvasRef} />
        </Toolbar>
      </div>
    );
  }
);

export default ReactCadViewer;
