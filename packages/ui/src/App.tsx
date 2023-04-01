import React from "react";
import ReactCADViewer from "@react-cad/viewer";

import useReactCADCore from "./useReactCADCore";

interface Props {
  shape: React.ReactElement;
  reset?: boolean;
}

const App: React.FC<Props> = ({ shape, reset }) => {
  const core = useReactCADCore();
  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      {core && (
        <ReactCADViewer
          core={core}
          shape={shape}
          reset={reset}
          name="Test"
          focus
          highDetail={[0.001, 0.5]}
          lowDetail={[0.01, 0.5]}
          borderless
        />
      )}
    </div>
  );
};

export default App;
