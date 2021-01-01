import React from "react";
import createPreviewWindow, {
  ReactCadCoreModule
} from "@react-cad/core";
import ReactCadRenderer from "@react-cad/renderer";

interface Props {
  shape: React.ReactElement<unknown>;
}

const ReactCadPreview: React.FC<Props> = ({ shape }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [
    previewWindow,
    setPreviewWindow
  ] = React.useState<ReactCadCoreModule>();

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
      ReactCadRenderer.render(shape, previewWindow, console.log);
    }
  }, [previewWindow, shape]);

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

export default ReactCadPreview;
