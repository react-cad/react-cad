import React from "react";

import { useReactCADRenderer } from "./hooks";
import { Detail } from "./types";

import ReactCADNodeViewer from "./ReactCADNodeViewer";

interface Props
  extends Omit<
    React.ComponentProps<typeof ReactCADNodeViewer>,
    "node" | "rerender" | "setDetail"
  > {
  shape: React.ReactElement<unknown>;
}

const ReactCADViewer = React.forwardRef<HTMLDivElement | undefined, Props>(
  ({ core, shape, reset, ...props }, forwardedRef) => {
    const [detail, setDetail] = React.useState<Detail>("LOW");

    const [rootNode, frameID, shouldReset] = useReactCADRenderer(
      core,
      shape,
      detail,
      reset
    );

    return (
      <ReactCADNodeViewer
        ref={forwardedRef}
        core={core}
        setDetail={setDetail}
        node={rootNode}
        reset={shouldReset}
        rerender={frameID}
        {...props}
      />
    );
  }
);

export default ReactCADViewer;
