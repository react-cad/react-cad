/// <reference types="resize-observer-browser" />
//
import React from "react";
import createPreviewWindow, { ReactCadCoreModule } from "@react-cad/core";
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

    const [
      previewWindow,
      setPreviewWindow
    ] = React.useState<ReactCadCoreModule>();

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
        createPreviewWindow({
          print: console.log,
          printErr: console.warn,
          canvas: canvasRef.current
        }).then(setPreviewWindow);
      }
    }, []);

    React.useEffect(() => {
      if (previewWindow) {
        ReactCadRenderer.render(shape, previewWindow, () => {});
      }
    }, [previewWindow, shape]);

    return (
      <div
        className={className}
        ref={wrapperRef}
      >
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
