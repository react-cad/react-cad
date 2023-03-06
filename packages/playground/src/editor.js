/* global window, document, sandbox */
window.createSandbox = new Promise((resolve, reject) => {
  // First set up the VSCode loader in a script tag
  const getLoaderScript = document.createElement("script");
  getLoaderScript.src = "./vs.loader.js";
  getLoaderScript.async = true;
  getLoaderScript.onload = () => {
    require.config({
      paths: {
        vs: "./vs",
        sandbox: "./sandbox",
      },
      // This is something you need for monaco to work
      ignoreDuplicateModules: ["vs/editor/editor.main"],
    });

    // Grab a copy of monaco, TypeScript and the sandbox
    require([
      "vs/editor/editor.main",
      "vs/language/typescript/tsWorker",
      "sandbox/index",
    ], (main, _tsWorker, sandboxFactory) => {
      const isOK = main && window.ts && sandboxFactory;

      if (!isOK) {
        reject("Could not get all the dependencies of sandbox set up!");
        console.error("main", !!main, "ts", !!window.ts, "sandbox", !!sandbox);
        return;
      }

      resolve((sandboxConfig) =>
        sandboxFactory.createTypeScriptSandbox(sandboxConfig, main, window.ts)
      );
    });
  };

  document.head.appendChild(getLoaderScript);
});
