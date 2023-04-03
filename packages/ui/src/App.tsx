import React from "react";
import ReactCADViewer from "@react-cad/viewer";

import useReactCADCore from "./useReactCADCore";

interface Props {
  shape: React.ReactElement;
}

const App: React.FC<Props> = ({ shape }) => {
  const core = useReactCADCore();

  const [reset, setReset] = React.useState(true);
  React.useEffect(() => setReset(true), [core]);
  React.useEffect(() => setReset(false), [reset]);

  return (
    <div style={{ position: "fixed", height: "100%", width: "100%" }}>
      {core && (
        <ReactCADViewer
          core={core}
          element={shape}
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
