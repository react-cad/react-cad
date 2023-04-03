import React from "react";

import { useReactCADRenderer } from "./hooks";
import { Detail } from "./types";

import ReactCADNodeViewer from "./ReactCADNodeViewer";
import RenderError from "./ErrorOverlay";

interface Props
  extends Omit<
    React.ComponentProps<typeof ReactCADNodeViewer>,
    "shape" | "setDetail"
  > {
  element?: React.ReactElement<unknown>;
  showStackTraceOnError?: boolean;
}

const ReactCADViewer = React.forwardRef<HTMLDivElement | undefined, Props>(
  ({ core, element, showStackTraceOnError = true, ...props }, forwardedRef) => {
    const [detail, setDetail] = React.useState<Detail>("LOW");

    const {
      taskManager,
      shape,
      computeError,
      renderError,
      renderErrorContext,
    } = useReactCADRenderer(core, element, detail);

    return (
      <div style={{ width: "100%", height: "100%", position: "relative" }}>
        <ReactCADNodeViewer
          ref={forwardedRef}
          core={core}
          taskManager={taskManager}
          setDetail={setDetail}
          shape={shape}
          {...props}
        />

        <RenderError
          computeError={computeError}
          renderError={renderError}
          renderErrorContext={renderErrorContext}
          showStackTrace={showStackTraceOnError}
        />
      </div>
    );
  }
);

export default ReactCADViewer;
