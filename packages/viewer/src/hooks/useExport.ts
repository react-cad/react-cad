import React from "react";
import type { ReactCADShape } from "@react-cad/core";

import { ExportFns } from "../types";
import TaskManager from "../TaskManager";

function download(
  content: string | ArrayBuffer,
  name: string,
  mimetype: string
) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mimetype }));
  a.download = name;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(a.href);
  document.body.removeChild(a);
}

function useExport(
  taskManager: TaskManager,
  shape: ReactCADShape | undefined,
  name: string | undefined
): ExportFns | undefined {
  const linearDeflection = 0.05;
  const angularDeflection = 0.5;

  const exportBREP = React.useCallback(
    () =>
      shape
        ? taskManager
            .exportBREP(shape)
            .then(
              (content) =>
                content &&
                download(content, `${name || "react-cad"}.brep`, "model/brep")
            )
        : Promise.reject(),
    [taskManager, shape, name]
  );

  const exportSTEP = React.useCallback(
    () =>
      shape
        ? taskManager
            .exportSTEP(shape)
            .then(
              (content) =>
                content &&
                download(content, `${name || "react-cad"}.step`, "model/step")
            )
        : Promise.reject(),
    [taskManager, shape, name]
  );

  const exportSTL = React.useCallback(
    () =>
      shape
        ? taskManager
            .exportSTL(shape, linearDeflection, angularDeflection)
            .then(
              (content) =>
                content &&
                download(content, `${name || "react-cad"}.stl`, "model/stl")
            )
        : Promise.reject(),
    [taskManager, shape, name]
  );

  return shape && { exportSTL, exportBREP, exportSTEP };
}

export default useExport;
