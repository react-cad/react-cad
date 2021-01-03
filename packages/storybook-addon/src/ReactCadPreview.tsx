/// <reference types="resize-observer-browser" />
//
import React from "react";
import reactCadCore, { ReactCadCoreModule } from "@react-cad/core";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";
import ReactCadRenderer from "@react-cad/renderer";

interface Props {
  className?: string;
  shape: React.ReactElement<unknown>;
}

const ReactCadPreview = React.forwardRef<HTMLDivElement | undefined, Props>(
  ({ className, shape }, forwardedRef) => {
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useImperativeHandle(
      forwardedRef,
      () => wrapperRef.current ?? undefined
    );

    const render = React.useRef<ReturnType<typeof ReactCadRenderer["render"]>>();

    const [{ width, height }, setDimensions] = React.useState({
      width: 640,
      height: 640
    });

    /*
    React.useLayoutEffect(() => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });

        if ("ResizeObserver" in window) {
          const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
              setDimensions({
                width: entry.contentRect.width,
                height: entry.contentRect.height
              });
            }
          });

          const wrapper = wrapperRef.current;
          resizeObserver.observe(wrapper);
          return () => resizeObserver.unobserve(wrapper);
        }
      }
    }, []);
    */

    React.useEffect(() => {
      if (canvasRef.current) {
        reactCadCore({
          print: console.log,
          printErr: console.warn,
          canvas: canvasRef.current,
          locateFile: () => reactCadCoreWasm
        }).then(core => {
          render.current = ReactCadRenderer.render(shape, core);
          core.fitShape();
        });
      }
    }, []);

    React.useEffect(() => {
      if (render.current) {
        render.current(shape);
      }
    }, [shape]);

    return (
      <div className={className} ref={wrapperRef}>
        <canvas
          style={{
            width: `${width}px`,
            height: `${height}px`,
            display: "block"
          }}
          width={width * window.devicePixelRatio}
          height={height * window.devicePixelRatio}
          ref={canvasRef}
        />
      </div>
    );
  }
);

export default ReactCadPreview;
