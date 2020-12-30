import reactCascadeCore from "../build/react-cascade-core.wasm";
import _createViewer from "../build/react-cascade-core";

const createViewer = Module =>
  _createViewer({
    ...Module,
    noExitRuntime: true,
    instantiateWasm: (imports, successCallback) => {
      const instance = reactCascadeCore(imports);
      successCallback(instance);
      return instance.exports;
    }
  });

export default createViewer;
