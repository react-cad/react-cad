import React from "react";
import type { Sandbox } from "@typescript/sandbox";

function useMonacoActions<R extends () => void>(
  sandbox: Sandbox | undefined,
  run: R
): void {
  const runCurrent = React.useRef(() => {});
  React.useEffect(() => {
    runCurrent.current = run;
  }, [run]);

  React.useEffect(() => {
    if (sandbox) {
      sandbox.editor.addAction({
        id: "react-cad-run",
        label: "Run",
        keybindings: [
          sandbox.monaco.KeyMod.CtrlCmd | sandbox.monaco.KeyCode.Enter,
        ],
        contextMenuGroupId: "navigation",
        contextMenuOrder: 1,
        run: () => runCurrent.current(),
      });
    }
  }, [sandbox]);
}

export default useMonacoActions;
