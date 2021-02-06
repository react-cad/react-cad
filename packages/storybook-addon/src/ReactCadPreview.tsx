import React from "react";
import reactCadCore, { ReactCADCore } from "@react-cad/core";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";
import ReactCadRenderer from "@react-cad/renderer";
import STLDownload from "./STLDownload";
import useStateWhenReady from "./useStateWhenReady";

interface Props {
  className?: string;
  shape: React.ReactElement<unknown>;
}

const ReactCadPreview = React.forwardRef<HTMLDivElement | undefined, Props>(
  ({ className, shape }, forwardedRef) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current ?? undefined
    );

    const coreRef = React.useRef<ReactCADCore>();
    const loaded = React.useRef<Promise<void>>(Promise.resolve());

    const [latestShape, setReady] = useStateWhenReady(shape);

    const canvasRef = React.useCallback((canvas: HTMLCanvasElement | null) => {
      if (canvas) {
        loaded.current = reactCadCore({
          canvas,
          locateFile: () => reactCadCoreWasm,
        })
          .then((core) => {
            coreRef.current = core;
            setReady(false);
            return ReactCadRenderer.render(shape, coreRef.current);
          })
          .then(() => setReady(true));
      } else {
        loaded.current.then(() => {
          if (coreRef.current) {
            ReactCadRenderer.destroyContainer(coreRef.current);
            try {
              coreRef.current._shutdown();
            } catch (e) {
              // Ignore emscripten exit message
            }
            coreRef.current = undefined;
          }
        });
      }
    }, []);

    React.useEffect(() => {
      if (coreRef.current) {
        setReady(false);
        ReactCadRenderer.render(latestShape, coreRef.current).then(() =>
          setReady(true)
        );
      }
    }, [latestShape]);

    const renderToSTL = React.useCallback(
      (
        linearDeflection: number,
        isRelative: boolean,
        angularDeflection: number
      ) =>
        coreRef.current
          ? ReactCadRenderer.renderToSTL(
              shape,
              coreRef.current,
              linearDeflection,
              isRelative,
              angularDeflection
            )
          : Promise.reject("react-cad not initialised"),
      [shape]
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
          filename={`${(shape.type as any).displayName || "react-cad"}.stl`}
          renderToSTL={renderToSTL}
        />
      </div>
    );
  }
);

export default ReactCadPreview;
