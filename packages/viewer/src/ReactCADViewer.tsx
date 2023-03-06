import React from "react";

import { useReactCADRenderer } from "./hooks";
import { Detail } from "./types";

import ReactCADNodeViewer from "./ReactCADNodeViewer";
import RenderError from "./ErrorOverlay";
import { GeometryError } from "@react-cad/core";

interface Props
  extends Omit<
    React.ComponentProps<typeof ReactCADNodeViewer>,
    "node" | "rerender" | "setDetail"
  > {
  shape?: React.ReactElement<unknown>;
  showStackTraceOnError?: boolean;
}

const ReactCADViewer = React.forwardRef<HTMLDivElement | undefined, Props>(
  (
    { core, shape, reset, showStackTraceOnError = true, ...props },
    forwardedRef
  ) => {
    const [detail, setDetail] = React.useState<Detail>("LOW");

    const [
      rootNode,
      frameID,
      shouldReset,
      renderError,
      renderErrorContext,
    ] = useReactCADRenderer(core, shape, detail, reset);

    const [geometryError, setGeometryError] = React.useState<GeometryError>();

    React.useEffect(() => setGeometryError(undefined), [frameID]);

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <ReactCADNodeViewer
          ref={forwardedRef}
          core={core}
          setDetail={setDetail}
          node={rootNode}
          reset={shouldReset}
          rerender={frameID}
          onError={setGeometryError}
          {...props}
        />

        <RenderError
          geometryError={geometryError}
          renderError={renderError}
          renderErrorContext={renderErrorContext}
          showStackTrace={showStackTraceOnError}
        />
      </div>
    );
  }
);

export default ReactCADViewer;
