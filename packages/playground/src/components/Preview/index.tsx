import React from "react";
import ReactCADViewer from "@react-cad/viewer";

import useReactCADCore from "./useReactCADCore";

interface Props {
  shape?: React.ReactElement<unknown>;
}

const Preview: React.FC<Props> = ({ shape }) => {
  const core = useReactCADCore();

  const [oldShape, setOldShape] = React.useState<React.ReactElement>();
  const [reset, setReset] = React.useState(false);
  React.useEffect(() => {
    setReset(shape !== oldShape);
    setOldShape(shape);
  }, [shape]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {core && (
        <ReactCADViewer
          borderless
          core={core}
          reset={reset}
          shape={oldShape}
          showStackTraceOnError={false}
        />
      )}
    </div>
  );
};

export default React.memo(Preview);
