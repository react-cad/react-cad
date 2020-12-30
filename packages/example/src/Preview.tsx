import React from "react";
import createPreviewWindow from "@react-cascade/core";

const ReactCascadePreview: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      createPreviewWindow({
        print: console.log,
        printErr: console.warn,
        canvas: canvasRef.current
      });
    }
  }, []);

  const width = 640;
  const height = 480;

  return (
    <canvas
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
      width={width * window.devicePixelRatio}
      height={height * window.devicePixelRatio}
      ref={canvasRef}
    />
  );
};

export default ReactCascadePreview;
