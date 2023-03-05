import React from "react";
import type { ReactCADCore, ReactCADNode } from "@react-cad/core";

import { ExportFns } from "../types";
import { AddTask } from "./useProgressQueue";

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
  core: ReactCADCore,
  addTask: AddTask,
  node: ReactCADNode,
  name: string | undefined
): ExportFns {
  const linearDeflection = 0.05;
  const angularDeflection = 0.5;

  const exportBREP = React.useCallback(
    () =>
      addTask(() => {
        const progress = core.renderBREP(node);

        progress.then(
          (content) =>
            content &&
            download(content, `${name || "react-cad"}.brep`, "model/brep")
        );

        return progress;
      }, false),
    [core, addTask, node, name]
  );

  const exportSTEP = React.useCallback(
    () =>
      addTask(() => {
        const progress = core.renderSTEP(node);

        progress.then(
          (content) =>
            content &&
            download(content, `${name || "react-cad"}.step`, "model/step")
        );

        return progress;
      }, false),
    [core, addTask, node, name]
  );

  const exportSTL = React.useCallback(
    () =>
      addTask(() => {
        const progress = core.renderSTL(
          node,
          linearDeflection,
          angularDeflection
        );

        progress.then(
          (content) =>
            content &&
            download(content, `${name || "react-cad"}.stl`, "model/stl")
        );

        return progress;
      }, false),
    [core, node, addTask, name]
  );

  return { exportSTL, exportBREP, exportSTEP };
}

export default useExport;
