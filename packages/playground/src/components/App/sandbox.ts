import { Sandbox, SandboxConfig } from "@typescript/sandbox";
import createSandbox from "@react-cad/create-sandbox";
import cadTypes from "!!raw-loader!@react-cad/renderer/lib/types.d.ts";
import jsxTypes from "!!raw-loader!react-cad/types/jsx/index.d.ts";

const initialText = `import React from "react";

const CADComponent: React.FC = () => (
  <intersection>
    <box center x={2} y={2} z={2} />
    <sphere radius={Math.sqrt(2)} />
  </intersection>
);

// Export a ReactCAD component to render it in the preview
export default CADComponent;`;

export default function setupSandbox(id: string): Sandbox {
  const sandboxConfig: Partial<SandboxConfig> = {
    text: initialText,
    filetype: "ts",
    domID: id,
  };

  const sandbox = createSandbox(sandboxConfig);

  window.addEventListener("resize", () => {
    sandbox.editor.layout();
  });

  sandbox.editor.focus();

  sandbox.languageServiceDefaults.addExtraLib(
    cadTypes,
    "file:///node_modules/@types/react-cad__renderer/index.d.ts"
  );
  sandbox.languageServiceDefaults.addExtraLib(
    jsxTypes,
    "file:///node_modules/@types/react-cad/index.d.ts"
  );

  return sandbox;
}
