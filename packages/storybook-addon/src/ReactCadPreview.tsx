/// <reference types="resize-observer-browser" />

import React from "react";
import reactCadCore from "@react-cad/core";
import reactCadCoreWasm from "@react-cad/core/lib/react-cad-core.wasm";
import ReactCadRenderer from "@react-cad/renderer";

function useStateWhenReady<T>(value: T) {
  const [ready, setReady] = React.useState(true);
  const [myValue, setMyValue] = React.useState(value);

  React.useEffect(() => {
    if (ready) {
      setMyValue(value);
    }
  }, [value, ready]);

  return [myValue, setReady] as [T, typeof setReady];
}

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

    const render = React.useRef<
      ReturnType<typeof ReactCadRenderer["render"]>
    >();

    /*
    const [{ width, height }, setDimensions] = React.useState({
      width: 640,
      height: 640
    });

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

    const [latestShape, setReady] = useStateWhenReady(shape);

    React.useEffect(() => {
      if (canvasRef.current) {
        reactCadCore({
          print: console.log,
          printErr: console.warn,
          canvas: canvasRef.current,
          locateFile: () => reactCadCoreWasm,
        }).then((core) => {
          setReady(false);
          core.init();
          render.current = ReactCadRenderer.render(shape, core, () =>
            setReady(true)
          );
          core.fitShape();
        });
      }
    }, []);

    React.useEffect(() => {
      if (render.current) {
        setReady(false);
        render.current(shape, () => setReady(true));
      }
    }, [latestShape]);

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
      </div>
    );
  }
);

export default ReactCadPreview;
