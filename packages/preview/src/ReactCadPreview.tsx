import React from "react";
import ReactCadRenderer from "@react-cad/renderer";
import STLDownload from "./STLDownload";

import { useReactCadCore, useReactCadRenderer } from "./hooks";

interface Props {
  className?: string;
  coreUrl: string;
  shape: React.ReactElement<unknown>;
  name?: string;
  reset?: boolean;
}

const ReactCadPreview = React.forwardRef<HTMLDivElement | undefined, Props>(
  ({ className, coreUrl, shape, name, reset }, forwardedRef) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current ?? undefined
    );

    const [core, canvasRef] = useReactCadCore(coreUrl);
    useReactCadRenderer(core, shape, reset);

    const renderToSTL = React.useCallback(
      (
        linearDeflection: number,
        isRelative: boolean,
        angularDeflection: number
      ) =>
        core
          ? ReactCadRenderer.renderToSTL(
              shape,
              core,
              linearDeflection,
              isRelative,
              angularDeflection
            )
          : Promise.reject("react-cad not initialised"),
      [core, shape]
    );

    const width = 640,
      height = 480;

    return (
      <div className={className} ref={wrapperRef}>
        <canvas
          style={{
            width: `${width}px`,
            height: `${height}px`,
            display: "block",
          }}
          width={width * window.devicePixelRatio}
          height={height * window.devicePixelRatio}
          ref={canvasRef}
        />
        <STLDownload
          filename={`${name || "react-cad"}.stl`}
          renderToSTL={renderToSTL}
        />
      </div>
    );
  }
);

export default ReactCadPreview;
