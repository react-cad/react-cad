import reactCadCore from "../build/react-cad-core.wasm";
import _createViewer from "../build/react-cad-core";

const createViewer = Module =>
  _createViewer({
    ...Module,
    noExitRuntime: true,
    instantiateWasm: (imports, successCallback) => {
      const instance = reactCadCore(imports);
      successCallback(instance);
      return instance.exports;
    }
  });

export default createViewer;
