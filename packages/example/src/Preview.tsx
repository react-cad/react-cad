import React from "react";
import createPreviewWindow from "@react-cascade/core";

const ReactCascadePreview: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (canvasRef.current) {
      createPreviewWindow({
        canvas: canvasRef.current
      });
    }
  }, []);

  const width = Math.max(
    300,
    Math.min(window.innerWidth, window.screen.availWidth) - 30
  );
  const height = Math.max(
    300,
    Math.min(window.innerHeight, window.screen.availHeight / 2)
  );

  return (
    <canvas
      style={{
        width: `${width}px`,
        height: `${height}px`
      }}
      width={width * window.devicePixelRatio}
      height={height * devicePixelRatio}
      ref={canvasRef}
    />
  );
};

export default ReactCascadePreview;
