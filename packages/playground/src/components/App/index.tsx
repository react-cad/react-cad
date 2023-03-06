import React from "react";
import type { Sandbox } from "@typescript/sandbox";

import createSandbox from "./sandbox";
import createModule from "./createModule";

import Editor from "../Editor";
import Preview from "../Preview";

import styles from "./styles.module.css";
import Header from "../Header";
import Warning from "../Warning";
import useMonacoActions from "./useMonacoActions";
import Toast from "../Toast";

interface Props {
  userProvidedCode: boolean;
}

const App: React.FC<Props> = ({ userProvidedCode }) => {
  const [shouldRun, setShouldRun] = React.useState(!userProvidedCode);
  const accept = React.useCallback(() => {
    setShouldRun(true);
  }, []);

  const [shape, setShape] = React.useState<React.ReactElement>();

  const [sandbox, setSandbox] = React.useState<Sandbox>();

  const setupEditor = React.useCallback(
    (id: string) => setSandbox(createSandbox(id)),
    [createSandbox]
  );

  const [showSaveMessage, setShowSaveMessage] = React.useState(0);

  const save = React.useCallback(
    async function () {
      if (sandbox) {
        // Update the URL, then write it to the clipboard
        const newURL = sandbox.createURLQueryWithCompilerOptions(sandbox);
        window.history.replaceState({}, "", newURL);
        setShowSaveMessage((value) => value + 1);
        return window.navigator.clipboard.writeText(location.href.toString());
      }
    },
    [sandbox]
  );

  const run = React.useCallback(
    async function () {
      if (sandbox && shouldRun) {
        const code = await sandbox.getRunnableJS();
        const { default: Shape } = await createModule(code);
        setShape(<Shape />);

        /*
         * TODO: get component props from typescript, auto generate form controls for customization
         *
         * const { program, system, host } = await sandbox.setupTSVFS();
         * const sourcefile = program.getSourceFile(sandbox.filepath);
         * console.log(sourcefile);
         *
         */
      }
    },
    [sandbox, shouldRun]
  );

  React.useEffect(() => {
    run();
  }, [run]);

  useMonacoActions(sandbox, run);

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.container}>
        <div className={styles.column}>
          <Preview shape={shape} />
          {!shouldRun && <Warning accept={accept} />}
        </div>
        <div className={styles.column}>
          <nav className={styles.menu}>
            <button
              className={styles.action}
              onClick={run}
              title="Run (Ctrl + Enter)"
            >
              Run
            </button>
            <button className={styles.action} onClick={save} title="Share">
              Share
            </button>
          </nav>
          <Editor setup={setupEditor} />
        </div>
      </main>
      <Toast show={showSaveMessage} />
    </div>
  );
};

export default App;
