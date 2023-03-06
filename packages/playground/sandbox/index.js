var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
define([
  "require",
  "exports",
  "./theme",
  "./compilerOptions",
  "./vendor/lzstring.min",
  "./release_data",
  "./getInitialCode",
  "./twoslashSupport",
  "./vendor/typescript-vfs",
  "./vendor/ata/index",
], function (
  require,
  exports,
  theme_1,
  compilerOptions_1,
  lzstring_min_1,
  release_data_1,
  getInitialCode_1,
  twoslashSupport_1,
  tsvfs,
  index_1
) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createTypeScriptSandbox = exports.defaultPlaygroundSettings = void 0;
  lzstring_min_1 = __importDefault(lzstring_min_1);
  tsvfs = __importStar(tsvfs);
  const languageType = (config) =>
    config.filetype === "js" ? "javascript" : "typescript";
  // Basically android and monaco is pretty bad, this makes it less bad
  // See https://github.com/microsoft/pxt/pull/7099 for this, and the long
  // read is in https://github.com/microsoft/monaco-editor/issues/563
  const isAndroid = navigator && /android/i.test(navigator.userAgent);
  /** Default Monaco settings for playground */
  const sharedEditorOptions = {
    scrollBeyondLastLine: true,
    scrollBeyondLastColumn: 3,
    minimap: {
      enabled: false,
    },
    lightbulb: {
      enabled: true,
    },
    quickSuggestions: {
      other: !isAndroid,
      comments: !isAndroid,
      strings: !isAndroid,
    },
    acceptSuggestionOnCommitCharacter: !isAndroid,
    acceptSuggestionOnEnter: !isAndroid ? "on" : "off",
    accessibilitySupport: !isAndroid ? "on" : "off",
    inlayHints: {
      enabled: true,
    },
  };
  /** The default settings which we apply a partial over */
  function defaultPlaygroundSettings() {
    const config = {
      text: "",
      domID: "",
      compilerOptions: {},
      acquireTypes: true,
      filetype: "ts",
      supportTwoslashCompilerOptions: false,
      logger: console,
    };
    return config;
  }
  exports.defaultPlaygroundSettings = defaultPlaygroundSettings;
  function defaultFilePath(config, compilerOptions, monaco) {
    const isJSX =
      compilerOptions.jsx !== monaco.languages.typescript.JsxEmit.None;
    const ext =
      isJSX && config.filetype !== "d.ts"
        ? config.filetype + "x"
        : config.filetype;
    return "input." + ext;
  }
  /** Creates a monaco file reference, basically a fancy path */
  function createFileUri(config, compilerOptions, monaco) {
    return monaco.Uri.file(defaultFilePath(config, compilerOptions, monaco));
  }
  /** Creates a sandbox editor, and returns a set of useful functions and the editor */
  const createTypeScriptSandbox = (partialConfig, monaco, ts) => {
    const config = Object.assign(
      Object.assign({}, defaultPlaygroundSettings()),
      partialConfig
    );
    if (!("domID" in config) && !("elementToAppend" in config))
      throw new Error("You did not provide a domID or elementToAppend");
    const defaultText = config.suppressAutomaticallyGettingDefaultText
      ? config.text
      : (0, getInitialCode_1.getInitialCode)(config.text, document.location);
    // Defaults
    const compilerDefaults = (0,
    compilerOptions_1.getDefaultSandboxCompilerOptions)(config, monaco);
    // Grab the compiler flags via the query params
    let compilerOptions;
    if (!config.suppressAutomaticallyGettingCompilerFlags) {
      const params = new URLSearchParams(location.search);
      let queryParamCompilerOptions = (0,
      compilerOptions_1.getCompilerOptionsFromParams)(
        compilerDefaults,
        ts,
        params
      );
      if (Object.keys(queryParamCompilerOptions).length)
        config.logger.log(
          "[Compiler] Found compiler options in query params: ",
          queryParamCompilerOptions
        );
      compilerOptions = Object.assign(
        Object.assign({}, compilerDefaults),
        queryParamCompilerOptions
      );
    } else {
      compilerOptions = compilerDefaults;
    }
    const isJSLang = config.filetype === "js";
    // Don't allow a state like allowJs = false
    if (isJSLang) {
      compilerOptions.allowJs = true;
    }
    const language = languageType(config);
    const filePath = createFileUri(config, compilerOptions, monaco);
    const element =
      "domID" in config
        ? document.getElementById(config.domID)
        : config.elementToAppend;
    const model = monaco.editor.createModel(defaultText, language, filePath);
    monaco.editor.defineTheme("sandbox", theme_1.sandboxTheme);
    monaco.editor.defineTheme("sandbox-dark", theme_1.sandboxThemeDark);
    monaco.editor.setTheme("sandbox");
    const monacoSettings = Object.assign(
      { model },
      sharedEditorOptions,
      config.monacoSettings || {}
    );
    const editor = monaco.editor.create(element, monacoSettings);
    const getWorker = isJSLang
      ? monaco.languages.typescript.getJavaScriptWorker
      : monaco.languages.typescript.getTypeScriptWorker;
    const defaults = isJSLang
      ? monaco.languages.typescript.javascriptDefaults
      : monaco.languages.typescript.typescriptDefaults;
    // @ts-ignore - these exist
    if (config.customTypeScriptWorkerPath && defaults.setWorkerOptions) {
      // @ts-ignore - this func must exist to have got here
      defaults.setWorkerOptions({
        customWorkerPath: config.customTypeScriptWorkerPath,
      });
    }
    defaults.setDiagnosticsOptions(
      Object.assign(Object.assign({}, defaults.getDiagnosticsOptions()), {
        noSemanticValidation: false,
        // This is when tslib is not found
        diagnosticCodesToIgnore: [2354],
      })
    );
    // In the future it'd be good to add support for an 'add many files'
    const addLibraryToRuntime = (code, _path) => {
      const path = "file://" + _path;
      defaults.addExtraLib(code, path);
      const uri = monaco.Uri.file(path);
      if (monaco.editor.getModel(uri) === null) {
        monaco.editor.createModel(code, "javascript", uri);
      }
      config.logger.log(`[ATA] Adding ${path} to runtime`, { code });
    };
    const getTwoSlashCompilerOptions = (0,
    twoslashSupport_1.extractTwoSlashCompilerOptions)(ts);
    // Auto-complete twoslash comments
    if (config.supportTwoslashCompilerOptions) {
      const langs = ["javascript", "typescript"];
      langs.forEach((l) =>
        monaco.languages.registerCompletionItemProvider(l, {
          triggerCharacters: ["@", "/", "-"],
          provideCompletionItems: (0, twoslashSupport_1.twoslashCompletions)(
            ts,
            monaco
          ),
        })
      );
    }
    const ata = (0, index_1.setupTypeAcquisition)({
      projectName: "TypeScript Playground",
      typescript: ts,
      logger: console,
      delegate: {
        receivedFile: addLibraryToRuntime,
        progress: (downloaded, total) => {
          // console.log({ dl, ttl })
        },
        started: () => {
          console.log("ATA start");
        },
        finished: (f) => {
          console.log("ATA done");
        },
      },
    });
    const textUpdated = () => {
      const code = editor.getModel().getValue();
      if (config.supportTwoslashCompilerOptions) {
        const configOpts = getTwoSlashCompilerOptions(code);
        updateCompilerSettings(configOpts);
      }
      if (config.acquireTypes) {
        ata(code);
      }
    };
    // Debounced sandbox features like twoslash and type acquisition to once every second
    let debouncingTimer = false;
    editor.onDidChangeModelContent((_e) => {
      if (debouncingTimer) return;
      debouncingTimer = true;
      setTimeout(() => {
        debouncingTimer = false;
        textUpdated();
      }, 1000);
    });
    config.logger.log("[Compiler] Set compiler options: ", compilerOptions);
    defaults.setCompilerOptions(compilerOptions);
    // To let clients plug into compiler settings changes
    let didUpdateCompilerSettings = (opts) => {};
    const updateCompilerSettings = (opts) => {
      const newKeys = Object.keys(opts);
      if (!newKeys.length) return;
      // Don't update a compiler setting if it's the same
      // as the current setting
      newKeys.forEach((key) => {
        if (compilerOptions[key] == opts[key]) delete opts[key];
      });
      if (!Object.keys(opts).length) return;
      config.logger.log("[Compiler] Updating compiler options: ", opts);
      compilerOptions = Object.assign(Object.assign({}, compilerOptions), opts);
      defaults.setCompilerOptions(compilerOptions);
      didUpdateCompilerSettings(compilerOptions);
    };
    const updateCompilerSetting = (key, value) => {
      config.logger.log(
        "[Compiler] Setting compiler options ",
        key,
        "to",
        value
      );
      compilerOptions[key] = value;
      defaults.setCompilerOptions(compilerOptions);
      didUpdateCompilerSettings(compilerOptions);
    };
    const setCompilerSettings = (opts) => {
      config.logger.log("[Compiler] Setting compiler options: ", opts);
      compilerOptions = opts;
      defaults.setCompilerOptions(compilerOptions);
      didUpdateCompilerSettings(compilerOptions);
    };
    const getCompilerOptions = () => {
      return compilerOptions;
    };
    const setDidUpdateCompilerSettings = (func) => {
      didUpdateCompilerSettings = func;
    };
    /** Gets the results of compiling your editor's code */
    const getEmitResult = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const model = editor.getModel();
        const client = yield getWorkerProcess();
        return yield client.getEmitOutput(model.uri.toString());
      });
    /** Gets the JS  of compiling your editor's code */
    const getRunnableJS = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        // This isn't quite _right_ in theory, we can downlevel JS -> JS
        // but a browser is basically always esnext-y and setting allowJs and
        // checkJs does not actually give the downlevel'd .js file in the output
        // later down the line.
        if (isJSLang) {
          return getText();
        }
        const result = yield getEmitResult();
        const firstJS = result.outputFiles.find(
          (o) => o.name.endsWith(".js") || o.name.endsWith(".jsx")
        );
        return (firstJS && firstJS.text) || "";
      });
    /** Gets the DTS for the JS/TS  of compiling your editor's code */
    const getDTSForCode = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const result = yield getEmitResult();
        return result.outputFiles.find((o) => o.name.endsWith(".d.ts")).text;
      });
    const getWorkerProcess = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const worker = yield getWorker();
        // @ts-ignore
        return yield worker(model.uri);
      });
    const getDomNode = () => editor.getDomNode();
    const getModel = () => editor.getModel();
    const getText = () => getModel().getValue();
    const setText = (text) => getModel().setValue(text);
    const setupTSVFS = (fsMapAdditions) =>
      __awaiter(void 0, void 0, void 0, function* () {
        const fsMap = yield tsvfs.createDefaultMapFromCDN(
          compilerOptions,
          ts.version,
          true,
          ts,
          lzstring_min_1.default
        );
        fsMap.set(filePath.path, getText());
        if (fsMapAdditions) {
          fsMapAdditions.forEach((v, k) => fsMap.set(k, v));
        }
        const system = tsvfs.createSystem(fsMap);
        const host = tsvfs.createVirtualCompilerHost(
          system,
          compilerOptions,
          ts
        );
        const program = ts.createProgram({
          rootNames: [...fsMap.keys()],
          options: compilerOptions,
          host: host.compilerHost,
        });
        return {
          program,
          system,
          host,
          fsMap,
        };
      });
    /**
     * Creates a TS Program, if you're doing anything complex
     * it's likely you want setupTSVFS instead and can pull program out from that
     *
     * Warning: Runs on the main thread
     */
    const createTSProgram = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const tsvfs = yield setupTSVFS();
        return tsvfs.program;
      });
    const getAST = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        const program = yield createTSProgram();
        program.emit();
        return program.getSourceFile(filePath.path);
      });
    // Pass along the supported releases for the playground
    const supportedVersions = release_data_1.supportedReleases;
    textUpdated();
    return {
      /** The same config you passed in */
      config,
      /** A list of TypeScript versions you can use with the TypeScript sandbox */
      supportedVersions,
      /** The monaco editor instance */
      editor,
      /** Either "typescript" or "javascript" depending on your config */
      language,
      /** The outer monaco module, the result of require("monaco-editor")  */
      monaco,
      /** Gets a monaco-typescript worker, this will give you access to a language server. Note: prefer this for language server work because it happens on a webworker . */
      getWorkerProcess,
      /** A copy of require("@typescript/vfs") this can be used to quickly set up an in-memory compiler runs for ASTs, or to get complex language server results (anything above has to be serialized when passed)*/
      tsvfs,
      /** Get all the different emitted files after TypeScript is run */
      getEmitResult,
      /** Gets just the JavaScript for your sandbox, will transpile if in TS only */
      getRunnableJS,
      /** Gets the DTS output of the main code in the editor */
      getDTSForCode,
      /** The monaco-editor dom node, used for showing/hiding the editor */
      getDomNode,
      /** The model is an object which monaco uses to keep track of text in the editor. Use this to directly modify the text in the editor */
      getModel,
      /** Gets the text of the main model, which is the text in the editor */
      getText,
      /** Shortcut for setting the model's text content which would update the editor */
      setText,
      /** Gets the AST of the current text in monaco - uses `createTSProgram`, so the performance caveat applies there too */
      getAST,
      /** The module you get from require("typescript") */
      ts,
      /** Create a new Program, a TypeScript data model which represents the entire project. As well as some of the
       * primitive objects you would normally need to do work with the files.
       *
       * The first time this is called it has to download all the DTS files which is needed for an exact compiler run. Which
       * at max is about 1.5MB - after that subsequent downloads of dts lib files come from localStorage.
       *
       * Try to use this sparingly as it can be computationally expensive, at the minimum you should be using the debounced setup.
       *
       * Accepts an optional fsMap which you can use to add any files, or overwrite the default file.
       *
       * TODO: It would be good to create an easy way to have a single program instance which is updated for you
       * when the monaco model changes.
       */
      setupTSVFS,
      /** Uses the above call setupTSVFS, but only returns the program */
      createTSProgram,
      /** The Sandbox's default compiler options  */
      compilerDefaults,
      /** The Sandbox's current compiler options */
      getCompilerOptions,
      /** Replace the Sandbox's compiler options */
      setCompilerSettings,
      /** Overwrite the Sandbox's compiler options */
      updateCompilerSetting,
      /** Update a single compiler option in the SAndbox */
      updateCompilerSettings,
      /** A way to get callbacks when compiler settings have changed */
      setDidUpdateCompilerSettings,
      /** A copy of lzstring, which is used to archive/unarchive code */
      lzstring: lzstring_min_1.default,
      /** Returns compiler options found in the params of the current page */
      createURLQueryWithCompilerOptions:
        compilerOptions_1.createURLQueryWithCompilerOptions,
      /**
       * @deprecated Use `getTwoSlashCompilerOptions` instead.
       *
       * Returns compiler options in the source code using twoslash notation
       */
      getTwoSlashComplierOptions: getTwoSlashCompilerOptions,
      /** Returns compiler options in the source code using twoslash notation */
      getTwoSlashCompilerOptions,
      /** Gets to the current monaco-language, this is how you talk to the background webworkers */
      languageServiceDefaults: defaults,
      /** The path which represents the current file using the current compiler options */
      filepath: filePath.path,
      /** Adds a file to the vfs used by the editor */
      addLibraryToRuntime,
    };
  };
  exports.createTypeScriptSandbox = createTypeScriptSandbox;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zYW5kYm94L3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQXNEQSxNQUFNLFlBQVksR0FBRyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUE7SUFFeEcscUVBQXFFO0lBQ3JFLHdFQUF3RTtJQUN4RSxtRUFBbUU7SUFDbkUsTUFBTSxTQUFTLEdBQUcsU0FBUyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0lBRW5FLDZDQUE2QztJQUM3QyxNQUFNLG1CQUFtQixHQUFrRDtRQUN6RSxvQkFBb0IsRUFBRSxJQUFJO1FBQzFCLHNCQUFzQixFQUFFLENBQUM7UUFDekIsT0FBTyxFQUFFO1lBQ1AsT0FBTyxFQUFFLEtBQUs7U0FDZjtRQUNELFNBQVMsRUFBRTtZQUNULE9BQU8sRUFBRSxJQUFJO1NBQ2Q7UUFDRCxnQkFBZ0IsRUFBRTtZQUNoQixLQUFLLEVBQUUsQ0FBQyxTQUFTO1lBQ2pCLFFBQVEsRUFBRSxDQUFDLFNBQVM7WUFDcEIsT0FBTyxFQUFFLENBQUMsU0FBUztTQUNwQjtRQUNELGlDQUFpQyxFQUFFLENBQUMsU0FBUztRQUM3Qyx1QkFBdUIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLO1FBQ2xELG9CQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUs7UUFDL0MsVUFBVSxFQUFFO1lBQ1YsT0FBTyxFQUFFLElBQUk7U0FDZDtLQUNGLENBQUE7SUFFRCx5REFBeUQ7SUFDekQsU0FB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Q04sb0RBQW9EO1lBQ3BELEVBQUU7WUFDRjs7Ozs7Ozs7Ozs7O2VBWUc7WUFDSCxVQUFVO1lBQ1YsbUVBQW1FO1lBQ25FLGVBQWU7WUFDZiw4Q0FBOEM7WUFDOUMsZ0JBQWdCO1lBQ2hCLDZDQUE2QztZQUM3QyxrQkFBa0I7WUFDbEIsNkNBQTZDO1lBQzdDLG1CQUFtQjtZQUNuQiwrQ0FBK0M7WUFDL0MscUJBQXFCO1lBQ3JCLHFEQUFxRDtZQUNyRCxzQkFBc0I7WUFDdEIsaUVBQWlFO1lBQ2pFLDRCQUE0QjtZQUM1QixrRUFBa0U7WUFDbEUsUUFBUSxFQUFSLHNCQUFRO1lBQ1IsdUVBQXVFO1lBQ3ZFLGlDQUFpQyxFQUFqQyxtREFBaUM7WUFDakM7Ozs7ZUFJRztZQUNILDBCQUEwQixFQUFFLDBCQUEwQjtZQUN0RCwwRUFBMEU7WUFDMUUsMEJBQTBCO1lBQzFCLDZGQUE2RjtZQUM3Rix1QkFBdUIsRUFBRSxRQUFRO1lBQ2pDLG9GQUFvRjtZQUNwRixRQUFRLEVBQUUsUUFBUSxDQUFDLElBQUk7WUFDdkIsZ0RBQWdEO1lBQ2hELG1CQUFtQjtTQUNwQixDQUFBO0lBQ0gsQ0FBQyxDQUFBO0lBMVZZLFFBQUEsdUJBQXVCLDJCQTBWbkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzYW5kYm94VGhlbWUsIHNhbmRib3hUaGVtZURhcmsgfSBmcm9tIFwiLi90aGVtZVwiXG5pbXBvcnQgeyBUeXBlU2NyaXB0V29ya2VyIH0gZnJvbSBcIi4vdHNXb3JrZXJcIlxuaW1wb3J0IHtcbiAgZ2V0RGVmYXVsdFNhbmRib3hDb21waWxlck9wdGlvbnMsXG4gIGdldENvbXBpbGVyT3B0aW9uc0Zyb21QYXJhbXMsXG4gIGNyZWF0ZVVSTFF1ZXJ5V2l0aENvbXBpbGVyT3B0aW9ucyxcbn0gZnJvbSBcIi4vY29tcGlsZXJPcHRpb25zXCJcbmltcG9ydCBsenN0cmluZyBmcm9tIFwiLi92ZW5kb3IvbHpzdHJpbmcubWluXCJcbmltcG9ydCB7IHN1cHBvcnRlZFJlbGVhc2VzIH0gZnJvbSBcIi4vcmVsZWFzZV9kYXRhXCJcbmltcG9ydCB7IGdldEluaXRpYWxDb2RlIH0gZnJvbSBcIi4vZ2V0SW5pdGlhbENvZGVcIlxuaW1wb3J0IHsgZXh0cmFjdFR3b1NsYXNoQ29tcGlsZXJPcHRpb25zLCB0d29zbGFzaENvbXBsZXRpb25zIH0gZnJvbSBcIi4vdHdvc2xhc2hTdXBwb3J0XCJcbmltcG9ydCAqIGFzIHRzdmZzIGZyb20gXCIuL3ZlbmRvci90eXBlc2NyaXB0LXZmc1wiXG5pbXBvcnQgeyBzZXR1cFR5cGVBY3F1aXNpdGlvbiB9IGZyb20gXCIuL3ZlbmRvci9hdGEvaW5kZXhcIlxuXG50eXBlIENvbXBpbGVyT3B0aW9ucyA9IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuQ29tcGlsZXJPcHRpb25zXG50eXBlIE1vbmFjbyA9IHR5cGVvZiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpXG5cbi8qKlxuICogVGhlc2UgYXJlIHNldHRpbmdzIGZvciB0aGUgcGxheWdyb3VuZCB3aGljaCBhcmUgdGhlIGVxdWl2YWxlbnQgdG8gcHJvcHMgaW4gUmVhY3RcbiAqIGFueSBjaGFuZ2VzIHRvIGl0IHNob3VsZCByZXF1aXJlIGEgbmV3IHNldHVwIG9mIHRoZSBwbGF5Z3JvdW5kXG4gKi9cbmV4cG9ydCB0eXBlIFNhbmRib3hDb25maWcgPSB7XG4gIC8qKiBUaGUgZGVmYXVsdCBzb3VyY2UgY29kZSBmb3IgdGhlIHBsYXlncm91bmQgKi9cbiAgdGV4dDogc3RyaW5nXG4gIC8qKiBAZGVwcmVjYXRlZCAqL1xuICB1c2VKYXZhU2NyaXB0PzogYm9vbGVhblxuICAvKiogVGhlIGRlZmF1bHQgZmlsZSBmb3IgdGhlIHBsYXlncm91bmQgICovXG4gIGZpbGV0eXBlOiBcImpzXCIgfCBcInRzXCIgfCBcImQudHNcIlxuICAvKiogQ29tcGlsZXIgb3B0aW9ucyB3aGljaCBhcmUgYXV0b21hdGljYWxseSBqdXN0IGZvcndhcmRlZCBvbiAqL1xuICBjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9uc1xuICAvKiogT3B0aW9uYWwgbW9uYWNvIHNldHRpbmdzIG92ZXJyaWRlcyAqL1xuICBtb25hY29TZXR0aW5ncz86IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikuZWRpdG9yLklFZGl0b3JPcHRpb25zXG4gIC8qKiBBY3F1aXJlIHR5cGVzIHZpYSB0eXBlIGFjcXVpc2l0aW9uICovXG4gIGFjcXVpcmVUeXBlczogYm9vbGVhblxuICAvKiogU3VwcG9ydCB0d29zbGFzaCBjb21waWxlciBvcHRpb25zICovXG4gIHN1cHBvcnRUd29zbGFzaENvbXBpbGVyT3B0aW9uczogYm9vbGVhblxuICAvKiogR2V0IHRoZSB0ZXh0IHZpYSBxdWVyeSBwYXJhbXMgYW5kIGxvY2FsIHN0b3JhZ2UsIHVzZWZ1bCB3aGVuIHRoZSBlZGl0b3IgaXMgdGhlIG1haW4gZXhwZXJpZW5jZSAqL1xuICBzdXBwcmVzc0F1dG9tYXRpY2FsbHlHZXR0aW5nRGVmYXVsdFRleHQ/OiB0cnVlXG4gIC8qKiBTdXBwcmVzcyBzZXR0aW5nIGNvbXBpbGVyIG9wdGlvbnMgZnJvbSB0aGUgY29tcGlsZXIgZmxhZ3MgZnJvbSBxdWVyeSBwYXJhbXMgKi9cbiAgc3VwcHJlc3NBdXRvbWF0aWNhbGx5R2V0dGluZ0NvbXBpbGVyRmxhZ3M/OiB0cnVlXG4gIC8qKiBPcHRpb25hbCBwYXRoIHRvIFR5cGVTY3JpcHQgd29ya2VyIHdyYXBwZXIgY2xhc3Mgc2NyaXB0LCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL21pY3Jvc29mdC9tb25hY28tdHlwZXNjcmlwdC9wdWxsLzY1ICAqL1xuICBjdXN0b21UeXBlU2NyaXB0V29ya2VyUGF0aD86IHN0cmluZ1xuICAvKiogTG9nZ2luZyBzeXN0ZW0gKi9cbiAgbG9nZ2VyOiB7XG4gICAgbG9nOiAoLi4uYXJnczogYW55W10pID0+IHZvaWRcbiAgICBlcnJvcjogKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkXG4gICAgZ3JvdXBDb2xsYXBzZWQ6ICguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZFxuICAgIGdyb3VwRW5kOiAoLi4uYXJnczogYW55W10pID0+IHZvaWRcbiAgfVxufSAmIChcbiAgfCB7IC8qKiB0aGUgSUQgb2YgYSBkb20gbm9kZSB0byBhZGQgbW9uYWNvIHRvICovIGRvbUlEOiBzdHJpbmcgfVxuICB8IHsgLyoqIHRoZSBkb20gbm9kZSB0byBhZGQgbW9uYWNvIHRvICovIGVsZW1lbnRUb0FwcGVuZDogSFRNTEVsZW1lbnQgfVxuKVxuXG5jb25zdCBsYW5ndWFnZVR5cGUgPSAoY29uZmlnOiBTYW5kYm94Q29uZmlnKSA9PiAoY29uZmlnLmZpbGV0eXBlID09PSBcImpzXCIgPyBcImphdmFzY3JpcHRcIiA6IFwidHlwZXNjcmlwdFwiKVxuXG4vLyBCYXNpY2FsbHkgYW5kcm9pZCBhbmQgbW9uYWNvIGlzIHByZXR0eSBiYWQsIHRoaXMgbWFrZXMgaXQgbGVzcyBiYWRcbi8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L3B4dC9wdWxsLzcwOTkgZm9yIHRoaXMsIGFuZCB0aGUgbG9uZ1xuLy8gcmVhZCBpcyBpbiBodHRwczovL2dpdGh1Yi5jb20vbWljcm9zb2Z0L21vbmFjby1lZGl0b3IvaXNzdWVzLzU2M1xuY29uc3QgaXNBbmRyb2lkID0gbmF2aWdhdG9yICYmIC9hbmRyb2lkL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KVxuXG4vKiogRGVmYXVsdCBNb25hY28gc2V0dGluZ3MgZm9yIHBsYXlncm91bmQgKi9cbmNvbnN0IHNoYXJlZEVkaXRvck9wdGlvbnM6IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikuZWRpdG9yLklFZGl0b3JPcHRpb25zID0ge1xuICBzY3JvbGxCZXlvbmRMYXN0TGluZTogdHJ1ZSxcbiAgc2Nyb2xsQmV5b25kTGFzdENvbHVtbjogMyxcbiAgbWluaW1hcDoge1xuICAgIGVuYWJsZWQ6IGZhbHNlLFxuICB9LFxuICBsaWdodGJ1bGI6IHtcbiAgICBlbmFibGVkOiB0cnVlLFxuICB9LFxuICBxdWlja1N1Z2dlc3Rpb25zOiB7XG4gICAgb3RoZXI6ICFpc0FuZHJvaWQsXG4gICAgY29tbWVudHM6ICFpc0FuZHJvaWQsXG4gICAgc3RyaW5nczogIWlzQW5kcm9pZCxcbiAgfSxcbiAgYWNjZXB0U3VnZ2VzdGlvbk9uQ29tbWl0Q2hhcmFjdGVyOiAhaXNBbmRyb2lkLFxuICBhY2NlcHRTdWdnZXN0aW9uT25FbnRlcjogIWlzQW5kcm9pZCA/IFwib25cIiA6IFwib2ZmXCIsXG4gIGFjY2Vzc2liaWxpdHlTdXBwb3J0OiAhaXNBbmRyb2lkID8gXCJvblwiIDogXCJvZmZcIixcbiAgaW5sYXlIaW50czoge1xuICAgIGVuYWJsZWQ6IHRydWUsXG4gIH0sXG59XG5cbi8qKiBUaGUgZGVmYXVsdCBzZXR0aW5ncyB3aGljaCB3ZSBhcHBseSBhIHBhcnRpYWwgb3ZlciAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRQbGF5Z3JvdW5kU2V0dGluZ3MoKSB7XG4gIGNvbnN0IGNvbmZpZzogU2FuZGJveENvbmZpZyA9IHtcbiAgICB0ZXh0OiBcIlwiLFxuICAgIGRvbUlEOiBcIlwiLFxuICAgIGNvbXBpbGVyT3B0aW9uczoge30sXG4gICAgYWNxdWlyZVR5cGVzOiB0cnVlLFxuICAgIGZpbGV0eXBlOiBcInRzXCIsXG4gICAgc3VwcG9ydFR3b3NsYXNoQ29tcGlsZXJPcHRpb25zOiBmYWxzZSxcbiAgICBsb2dnZXI6IGNvbnNvbGUsXG4gIH1cbiAgcmV0dXJuIGNvbmZpZ1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0RmlsZVBhdGgoY29uZmlnOiBTYW5kYm94Q29uZmlnLCBjb21waWxlck9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucywgbW9uYWNvOiBNb25hY28pIHtcbiAgY29uc3QgaXNKU1ggPSBjb21waWxlck9wdGlvbnMuanN4ICE9PSBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuSnN4RW1pdC5Ob25lXG4gIGNvbnN0IGV4dCA9IGlzSlNYICYmIGNvbmZpZy5maWxldHlwZSAhPT0gXCJkLnRzXCIgPyBjb25maWcuZmlsZXR5cGUgKyBcInhcIiA6IGNvbmZpZy5maWxldHlwZVxuICByZXR1cm4gXCJpbnB1dC5cIiArIGV4dFxufVxuXG4vKiogQ3JlYXRlcyBhIG1vbmFjbyBmaWxlIHJlZmVyZW5jZSwgYmFzaWNhbGx5IGEgZmFuY3kgcGF0aCAqL1xuZnVuY3Rpb24gY3JlYXRlRmlsZVVyaShjb25maWc6IFNhbmRib3hDb25maWcsIGNvbXBpbGVyT3B0aW9uczogQ29tcGlsZXJPcHRpb25zLCBtb25hY286IE1vbmFjbykge1xuICByZXR1cm4gbW9uYWNvLlVyaS5maWxlKGRlZmF1bHRGaWxlUGF0aChjb25maWcsIGNvbXBpbGVyT3B0aW9ucywgbW9uYWNvKSlcbn1cblxuLyoqIENyZWF0ZXMgYSBzYW5kYm94IGVkaXRvciwgYW5kIHJldHVybnMgYSBzZXQgb2YgdXNlZnVsIGZ1bmN0aW9ucyBhbmQgdGhlIGVkaXRvciAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVR5cGVTY3JpcHRTYW5kYm94ID0gKFxuICBwYXJ0aWFsQ29uZmlnOiBQYXJ0aWFsPFNhbmRib3hDb25maWc+LFxuICBtb25hY286IE1vbmFjbyxcbiAgdHM6IHR5cGVvZiBpbXBvcnQoXCJ0eXBlc2NyaXB0XCIpXG4pID0+IHtcbiAgY29uc3QgY29uZmlnID0geyAuLi5kZWZhdWx0UGxheWdyb3VuZFNldHRpbmdzKCksIC4uLnBhcnRpYWxDb25maWcgfVxuICBpZiAoIShcImRvbUlEXCIgaW4gY29uZmlnKSAmJiAhKFwiZWxlbWVudFRvQXBwZW5kXCIgaW4gY29uZmlnKSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3UgZGlkIG5vdCBwcm92aWRlIGEgZG9tSUQgb3IgZWxlbWVudFRvQXBwZW5kXCIpXG5cbiAgY29uc3QgZGVmYXVsdFRleHQgPSBjb25maWcuc3VwcHJlc3NBdXRvbWF0aWNhbGx5R2V0dGluZ0RlZmF1bHRUZXh0XG4gICAgPyBjb25maWcudGV4dFxuICAgIDogZ2V0SW5pdGlhbENvZGUoY29uZmlnLnRleHQsIGRvY3VtZW50LmxvY2F0aW9uKVxuXG4gIC8vIERlZmF1bHRzXG4gIGNvbnN0IGNvbXBpbGVyRGVmYXVsdHMgPSBnZXREZWZhdWx0U2FuZGJveENvbXBpbGVyT3B0aW9ucyhjb25maWcsIG1vbmFjbylcblxuICAvLyBHcmFiIHRoZSBjb21waWxlciBmbGFncyB2aWEgdGhlIHF1ZXJ5IHBhcmFtc1xuICBsZXQgY29tcGlsZXJPcHRpb25zOiBDb21waWxlck9wdGlvbnNcbiAgaWYgKCFjb25maWcuc3VwcHJlc3NBdXRvbWF0aWNhbGx5R2V0dGluZ0NvbXBpbGVyRmxhZ3MpIHtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaClcbiAgICBsZXQgcXVlcnlQYXJhbUNvbXBpbGVyT3B0aW9ucyA9IGdldENvbXBpbGVyT3B0aW9uc0Zyb21QYXJhbXMoY29tcGlsZXJEZWZhdWx0cywgdHMsIHBhcmFtcylcbiAgICBpZiAoT2JqZWN0LmtleXMocXVlcnlQYXJhbUNvbXBpbGVyT3B0aW9ucykubGVuZ3RoKVxuICAgICAgY29uZmlnLmxvZ2dlci5sb2coXCJbQ29tcGlsZXJdIEZvdW5kIGNvbXBpbGVyIG9wdGlvbnMgaW4gcXVlcnkgcGFyYW1zOiBcIiwgcXVlcnlQYXJhbUNvbXBpbGVyT3B0aW9ucylcbiAgICBjb21waWxlck9wdGlvbnMgPSB7IC4uLmNvbXBpbGVyRGVmYXVsdHMsIC4uLnF1ZXJ5UGFyYW1Db21waWxlck9wdGlvbnMgfVxuICB9IGVsc2Uge1xuICAgIGNvbXBpbGVyT3B0aW9ucyA9IGNvbXBpbGVyRGVmYXVsdHNcbiAgfVxuXG4gIGNvbnN0IGlzSlNMYW5nID0gY29uZmlnLmZpbGV0eXBlID09PSBcImpzXCJcbiAgLy8gRG9uJ3QgYWxsb3cgYSBzdGF0ZSBsaWtlIGFsbG93SnMgPSBmYWxzZVxuICBpZiAoaXNKU0xhbmcpIHtcbiAgICBjb21waWxlck9wdGlvbnMuYWxsb3dKcyA9IHRydWVcbiAgfVxuXG4gIGNvbnN0IGxhbmd1YWdlID0gbGFuZ3VhZ2VUeXBlKGNvbmZpZylcbiAgY29uc3QgZmlsZVBhdGggPSBjcmVhdGVGaWxlVXJpKGNvbmZpZywgY29tcGlsZXJPcHRpb25zLCBtb25hY28pXG4gIGNvbnN0IGVsZW1lbnQgPSBcImRvbUlEXCIgaW4gY29uZmlnID8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoY29uZmlnLmRvbUlEKSA6IChjb25maWcgYXMgYW55KS5lbGVtZW50VG9BcHBlbmRcblxuICBjb25zdCBtb2RlbCA9IG1vbmFjby5lZGl0b3IuY3JlYXRlTW9kZWwoZGVmYXVsdFRleHQsIGxhbmd1YWdlLCBmaWxlUGF0aClcbiAgbW9uYWNvLmVkaXRvci5kZWZpbmVUaGVtZShcInNhbmRib3hcIiwgc2FuZGJveFRoZW1lKVxuICBtb25hY28uZWRpdG9yLmRlZmluZVRoZW1lKFwic2FuZGJveC1kYXJrXCIsIHNhbmRib3hUaGVtZURhcmspXG4gIG1vbmFjby5lZGl0b3Iuc2V0VGhlbWUoXCJzYW5kYm94XCIpXG5cbiAgY29uc3QgbW9uYWNvU2V0dGluZ3MgPSBPYmplY3QuYXNzaWduKHsgbW9kZWwgfSwgc2hhcmVkRWRpdG9yT3B0aW9ucywgY29uZmlnLm1vbmFjb1NldHRpbmdzIHx8IHt9KVxuICBjb25zdCBlZGl0b3IgPSBtb25hY28uZWRpdG9yLmNyZWF0ZShlbGVtZW50LCBtb25hY29TZXR0aW5ncylcblxuICBjb25zdCBnZXRXb3JrZXIgPSBpc0pTTGFuZ1xuICAgID8gbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0LmdldEphdmFTY3JpcHRXb3JrZXJcbiAgICA6IG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5nZXRUeXBlU2NyaXB0V29ya2VyXG5cbiAgY29uc3QgZGVmYXVsdHMgPSBpc0pTTGFuZ1xuICAgID8gbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0LmphdmFzY3JpcHREZWZhdWx0c1xuICAgIDogbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0LnR5cGVzY3JpcHREZWZhdWx0c1xuXG4gIC8vIEB0cy1pZ25vcmUgLSB0aGVzZSBleGlzdFxuICBpZiAoY29uZmlnLmN1c3RvbVR5cGVTY3JpcHRXb3JrZXJQYXRoICYmIGRlZmF1bHRzLnNldFdvcmtlck9wdGlvbnMpIHtcbiAgICAvLyBAdHMtaWdub3JlIC0gdGhpcyBmdW5jIG11c3QgZXhpc3QgdG8gaGF2ZSBnb3QgaGVyZVxuICAgIGRlZmF1bHRzLnNldFdvcmtlck9wdGlvbnMoe1xuICAgICAgY3VzdG9tV29ya2VyUGF0aDogY29uZmlnLmN1c3RvbVR5cGVTY3JpcHRXb3JrZXJQYXRoLFxuICAgIH0pXG4gIH1cblxuICBkZWZhdWx0cy5zZXREaWFnbm9zdGljc09wdGlvbnMoe1xuICAgIC4uLmRlZmF1bHRzLmdldERpYWdub3N0aWNzT3B0aW9ucygpLFxuICAgIG5vU2VtYW50aWNWYWxpZGF0aW9uOiBmYWxzZSxcbiAgICAvLyBUaGlzIGlzIHdoZW4gdHNsaWIgaXMgbm90IGZvdW5kXG4gICAgZGlhZ25vc3RpY0NvZGVzVG9JZ25vcmU6IFsyMzU0XSxcbiAgfSlcblxuICAvLyBJbiB0aGUgZnV0dXJlIGl0J2QgYmUgZ29vZCB0byBhZGQgc3VwcG9ydCBmb3IgYW4gJ2FkZCBtYW55IGZpbGVzJ1xuICBjb25zdCBhZGRMaWJyYXJ5VG9SdW50aW1lID0gKGNvZGU6IHN0cmluZywgX3BhdGg6IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IHBhdGggPSBcImZpbGU6Ly9cIiArIF9wYXRoXG4gICAgZGVmYXVsdHMuYWRkRXh0cmFMaWIoY29kZSwgcGF0aClcbiAgICBjb25zdCB1cmkgPSBtb25hY28uVXJpLmZpbGUocGF0aClcbiAgICBpZiAobW9uYWNvLmVkaXRvci5nZXRNb2RlbCh1cmkpID09PSBudWxsKSB7XG4gICAgICBtb25hY28uZWRpdG9yLmNyZWF0ZU1vZGVsKGNvZGUsIFwiamF2YXNjcmlwdFwiLCB1cmkpXG4gICAgfVxuICAgIGNvbmZpZy5sb2dnZXIubG9nKGBbQVRBXSBBZGRpbmcgJHtwYXRofSB0byBydW50aW1lYCwgeyBjb2RlIH0pXG4gIH1cblxuICBjb25zdCBnZXRUd29TbGFzaENvbXBpbGVyT3B0aW9ucyA9IGV4dHJhY3RUd29TbGFzaENvbXBpbGVyT3B0aW9ucyh0cylcblxuICAvLyBBdXRvLWNvbXBsZXRlIHR3b3NsYXNoIGNvbW1lbnRzXG4gIGlmIChjb25maWcuc3VwcG9ydFR3b3NsYXNoQ29tcGlsZXJPcHRpb25zKSB7XG4gICAgY29uc3QgbGFuZ3MgPSBbXCJqYXZhc2NyaXB0XCIsIFwidHlwZXNjcmlwdFwiXVxuICAgIGxhbmdzLmZvckVhY2gobCA9PlxuICAgICAgbW9uYWNvLmxhbmd1YWdlcy5yZWdpc3RlckNvbXBsZXRpb25JdGVtUHJvdmlkZXIobCwge1xuICAgICAgICB0cmlnZ2VyQ2hhcmFjdGVyczogW1wiQFwiLCBcIi9cIiwgXCItXCJdLFxuICAgICAgICBwcm92aWRlQ29tcGxldGlvbkl0ZW1zOiB0d29zbGFzaENvbXBsZXRpb25zKHRzLCBtb25hY28pLFxuICAgICAgfSlcbiAgICApXG4gIH1cblxuICBjb25zdCBhdGEgPSBzZXR1cFR5cGVBY3F1aXNpdGlvbih7XG4gICAgcHJvamVjdE5hbWU6IFwiVHlwZVNjcmlwdCBQbGF5Z3JvdW5kXCIsXG4gICAgdHlwZXNjcmlwdDogdHMsXG4gICAgbG9nZ2VyOiBjb25zb2xlLFxuICAgIGRlbGVnYXRlOiB7XG4gICAgICByZWNlaXZlZEZpbGU6IGFkZExpYnJhcnlUb1J1bnRpbWUsXG4gICAgICBwcm9ncmVzczogKGRvd25sb2FkZWQ6IG51bWJlciwgdG90YWw6IG51bWJlcikgPT4ge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh7IGRsLCB0dGwgfSlcbiAgICAgIH0sXG4gICAgICBzdGFydGVkOiAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQVRBIHN0YXJ0XCIpXG4gICAgICB9LFxuICAgICAgZmluaXNoZWQ6IGYgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFUQSBkb25lXCIpXG4gICAgICB9LFxuICAgIH0sXG4gIH0pXG5cbiAgY29uc3QgdGV4dFVwZGF0ZWQgPSAoKSA9PiB7XG4gICAgY29uc3QgY29kZSA9IGVkaXRvci5nZXRNb2RlbCgpIS5nZXRWYWx1ZSgpXG5cbiAgICBpZiAoY29uZmlnLnN1cHBvcnRUd29zbGFzaENvbXBpbGVyT3B0aW9ucykge1xuICAgICAgY29uc3QgY29uZmlnT3B0cyA9IGdldFR3b1NsYXNoQ29tcGlsZXJPcHRpb25zKGNvZGUpXG4gICAgICB1cGRhdGVDb21waWxlclNldHRpbmdzKGNvbmZpZ09wdHMpXG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZy5hY3F1aXJlVHlwZXMpIHtcbiAgICAgIGF0YShjb2RlKVxuICAgIH1cbiAgfVxuXG4gIC8vIERlYm91bmNlZCBzYW5kYm94IGZlYXR1cmVzIGxpa2UgdHdvc2xhc2ggYW5kIHR5cGUgYWNxdWlzaXRpb24gdG8gb25jZSBldmVyeSBzZWNvbmRcbiAgbGV0IGRlYm91bmNpbmdUaW1lciA9IGZhbHNlXG4gIGVkaXRvci5vbkRpZENoYW5nZU1vZGVsQ29udGVudChfZSA9PiB7XG4gICAgaWYgKGRlYm91bmNpbmdUaW1lcikgcmV0dXJuXG4gICAgZGVib3VuY2luZ1RpbWVyID0gdHJ1ZVxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgZGVib3VuY2luZ1RpbWVyID0gZmFsc2VcbiAgICAgIHRleHRVcGRhdGVkKClcbiAgICB9LCAxMDAwKVxuICB9KVxuXG4gIGNvbmZpZy5sb2dnZXIubG9nKFwiW0NvbXBpbGVyXSBTZXQgY29tcGlsZXIgb3B0aW9uczogXCIsIGNvbXBpbGVyT3B0aW9ucylcbiAgZGVmYXVsdHMuc2V0Q29tcGlsZXJPcHRpb25zKGNvbXBpbGVyT3B0aW9ucylcblxuICAvLyBUbyBsZXQgY2xpZW50cyBwbHVnIGludG8gY29tcGlsZXIgc2V0dGluZ3MgY2hhbmdlc1xuICBsZXQgZGlkVXBkYXRlQ29tcGlsZXJTZXR0aW5ncyA9IChvcHRzOiBDb21waWxlck9wdGlvbnMpID0+IHt9XG5cbiAgY29uc3QgdXBkYXRlQ29tcGlsZXJTZXR0aW5ncyA9IChvcHRzOiBDb21waWxlck9wdGlvbnMpID0+IHtcbiAgICBjb25zdCBuZXdLZXlzID0gT2JqZWN0LmtleXMob3B0cylcbiAgICBpZiAoIW5ld0tleXMubGVuZ3RoKSByZXR1cm5cblxuICAgIC8vIERvbid0IHVwZGF0ZSBhIGNvbXBpbGVyIHNldHRpbmcgaWYgaXQncyB0aGUgc2FtZVxuICAgIC8vIGFzIHRoZSBjdXJyZW50IHNldHRpbmdcbiAgICBuZXdLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChjb21waWxlck9wdGlvbnNba2V5XSA9PSBvcHRzW2tleV0pIGRlbGV0ZSBvcHRzW2tleV1cbiAgICB9KVxuXG4gICAgaWYgKCFPYmplY3Qua2V5cyhvcHRzKS5sZW5ndGgpIHJldHVyblxuXG4gICAgY29uZmlnLmxvZ2dlci5sb2coXCJbQ29tcGlsZXJdIFVwZGF0aW5nIGNvbXBpbGVyIG9wdGlvbnM6IFwiLCBvcHRzKVxuXG4gICAgY29tcGlsZXJPcHRpb25zID0geyAuLi5jb21waWxlck9wdGlvbnMsIC4uLm9wdHMgfVxuICAgIGRlZmF1bHRzLnNldENvbXBpbGVyT3B0aW9ucyhjb21waWxlck9wdGlvbnMpXG4gICAgZGlkVXBkYXRlQ29tcGlsZXJTZXR0aW5ncyhjb21waWxlck9wdGlvbnMpXG4gIH1cblxuICBjb25zdCB1cGRhdGVDb21waWxlclNldHRpbmcgPSAoa2V5OiBrZXlvZiBDb21waWxlck9wdGlvbnMsIHZhbHVlOiBhbnkpID0+IHtcbiAgICBjb25maWcubG9nZ2VyLmxvZyhcIltDb21waWxlcl0gU2V0dGluZyBjb21waWxlciBvcHRpb25zIFwiLCBrZXksIFwidG9cIiwgdmFsdWUpXG4gICAgY29tcGlsZXJPcHRpb25zW2tleV0gPSB2YWx1ZVxuICAgIGRlZmF1bHRzLnNldENvbXBpbGVyT3B0aW9ucyhjb21waWxlck9wdGlvbnMpXG4gICAgZGlkVXBkYXRlQ29tcGlsZXJTZXR0aW5ncyhjb21waWxlck9wdGlvbnMpXG4gIH1cblxuICBjb25zdCBzZXRDb21waWxlclNldHRpbmdzID0gKG9wdHM6IENvbXBpbGVyT3B0aW9ucykgPT4ge1xuICAgIGNvbmZpZy5sb2dnZXIubG9nKFwiW0NvbXBpbGVyXSBTZXR0aW5nIGNvbXBpbGVyIG9wdGlvbnM6IFwiLCBvcHRzKVxuICAgIGNvbXBpbGVyT3B0aW9ucyA9IG9wdHNcbiAgICBkZWZhdWx0cy5zZXRDb21waWxlck9wdGlvbnMoY29tcGlsZXJPcHRpb25zKVxuICAgIGRpZFVwZGF0ZUNvbXBpbGVyU2V0dGluZ3MoY29tcGlsZXJPcHRpb25zKVxuICB9XG5cbiAgY29uc3QgZ2V0Q29tcGlsZXJPcHRpb25zID0gKCkgPT4ge1xuICAgIHJldHVybiBjb21waWxlck9wdGlvbnNcbiAgfVxuXG4gIGNvbnN0IHNldERpZFVwZGF0ZUNvbXBpbGVyU2V0dGluZ3MgPSAoZnVuYzogKG9wdHM6IENvbXBpbGVyT3B0aW9ucykgPT4gdm9pZCkgPT4ge1xuICAgIGRpZFVwZGF0ZUNvbXBpbGVyU2V0dGluZ3MgPSBmdW5jXG4gIH1cblxuICAvKiogR2V0cyB0aGUgcmVzdWx0cyBvZiBjb21waWxpbmcgeW91ciBlZGl0b3IncyBjb2RlICovXG4gIGNvbnN0IGdldEVtaXRSZXN1bHQgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBlZGl0b3IuZ2V0TW9kZWwoKSFcbiAgICBjb25zdCBjbGllbnQgPSBhd2FpdCBnZXRXb3JrZXJQcm9jZXNzKClcbiAgICByZXR1cm4gYXdhaXQgY2xpZW50LmdldEVtaXRPdXRwdXQobW9kZWwudXJpLnRvU3RyaW5nKCkpXG4gIH1cblxuICAvKiogR2V0cyB0aGUgSlMgIG9mIGNvbXBpbGluZyB5b3VyIGVkaXRvcidzIGNvZGUgKi9cbiAgY29uc3QgZ2V0UnVubmFibGVKUyA9IGFzeW5jICgpID0+IHtcbiAgICAvLyBUaGlzIGlzbid0IHF1aXRlIF9yaWdodF8gaW4gdGhlb3J5LCB3ZSBjYW4gZG93bmxldmVsIEpTIC0+IEpTXG4gICAgLy8gYnV0IGEgYnJvd3NlciBpcyBiYXNpY2FsbHkgYWx3YXlzIGVzbmV4dC15IGFuZCBzZXR0aW5nIGFsbG93SnMgYW5kXG4gICAgLy8gY2hlY2tKcyBkb2VzIG5vdCBhY3R1YWxseSBnaXZlIHRoZSBkb3dubGV2ZWwnZCAuanMgZmlsZSBpbiB0aGUgb3V0cHV0XG4gICAgLy8gbGF0ZXIgZG93biB0aGUgbGluZS5cbiAgICBpZiAoaXNKU0xhbmcpIHtcbiAgICAgIHJldHVybiBnZXRUZXh0KClcbiAgICB9XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0RW1pdFJlc3VsdCgpXG4gICAgY29uc3QgZmlyc3RKUyA9IHJlc3VsdC5vdXRwdXRGaWxlcy5maW5kKChvOiBhbnkpID0+IG8ubmFtZS5lbmRzV2l0aChcIi5qc1wiKSB8fCBvLm5hbWUuZW5kc1dpdGgoXCIuanN4XCIpKVxuICAgIHJldHVybiAoZmlyc3RKUyAmJiBmaXJzdEpTLnRleHQpIHx8IFwiXCJcbiAgfVxuXG4gIC8qKiBHZXRzIHRoZSBEVFMgZm9yIHRoZSBKUy9UUyAgb2YgY29tcGlsaW5nIHlvdXIgZWRpdG9yJ3MgY29kZSAqL1xuICBjb25zdCBnZXREVFNGb3JDb2RlID0gYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGdldEVtaXRSZXN1bHQoKVxuICAgIHJldHVybiByZXN1bHQub3V0cHV0RmlsZXMuZmluZCgobzogYW55KSA9PiBvLm5hbWUuZW5kc1dpdGgoXCIuZC50c1wiKSkhLnRleHRcbiAgfVxuXG4gIGNvbnN0IGdldFdvcmtlclByb2Nlc3MgPSBhc3luYyAoKTogUHJvbWlzZTxUeXBlU2NyaXB0V29ya2VyPiA9PiB7XG4gICAgY29uc3Qgd29ya2VyID0gYXdhaXQgZ2V0V29ya2VyKClcbiAgICAvLyBAdHMtaWdub3JlXG4gICAgcmV0dXJuIGF3YWl0IHdvcmtlcihtb2RlbC51cmkpXG4gIH1cblxuICBjb25zdCBnZXREb21Ob2RlID0gKCkgPT4gZWRpdG9yLmdldERvbU5vZGUoKSFcbiAgY29uc3QgZ2V0TW9kZWwgPSAoKSA9PiBlZGl0b3IuZ2V0TW9kZWwoKSFcbiAgY29uc3QgZ2V0VGV4dCA9ICgpID0+IGdldE1vZGVsKCkuZ2V0VmFsdWUoKVxuICBjb25zdCBzZXRUZXh0ID0gKHRleHQ6IHN0cmluZykgPT4gZ2V0TW9kZWwoKS5zZXRWYWx1ZSh0ZXh0KVxuXG4gIGNvbnN0IHNldHVwVFNWRlMgPSBhc3luYyAoZnNNYXBBZGRpdGlvbnM/OiBNYXA8c3RyaW5nLCBzdHJpbmc+KSA9PiB7XG4gICAgY29uc3QgZnNNYXAgPSBhd2FpdCB0c3Zmcy5jcmVhdGVEZWZhdWx0TWFwRnJvbUNETihjb21waWxlck9wdGlvbnMsIHRzLnZlcnNpb24sIHRydWUsIHRzLCBsenN0cmluZylcbiAgICBmc01hcC5zZXQoZmlsZVBhdGgucGF0aCwgZ2V0VGV4dCgpKVxuICAgIGlmIChmc01hcEFkZGl0aW9ucykge1xuICAgICAgZnNNYXBBZGRpdGlvbnMuZm9yRWFjaCgodiwgaykgPT4gZnNNYXAuc2V0KGssIHYpKVxuICAgIH1cblxuICAgIGNvbnN0IHN5c3RlbSA9IHRzdmZzLmNyZWF0ZVN5c3RlbShmc01hcClcbiAgICBjb25zdCBob3N0ID0gdHN2ZnMuY3JlYXRlVmlydHVhbENvbXBpbGVySG9zdChzeXN0ZW0sIGNvbXBpbGVyT3B0aW9ucywgdHMpXG5cbiAgICBjb25zdCBwcm9ncmFtID0gdHMuY3JlYXRlUHJvZ3JhbSh7XG4gICAgICByb290TmFtZXM6IFsuLi5mc01hcC5rZXlzKCldLFxuICAgICAgb3B0aW9uczogY29tcGlsZXJPcHRpb25zLFxuICAgICAgaG9zdDogaG9zdC5jb21waWxlckhvc3QsXG4gICAgfSlcblxuICAgIHJldHVybiB7XG4gICAgICBwcm9ncmFtLFxuICAgICAgc3lzdGVtLFxuICAgICAgaG9zdCxcbiAgICAgIGZzTWFwLFxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgVFMgUHJvZ3JhbSwgaWYgeW91J3JlIGRvaW5nIGFueXRoaW5nIGNvbXBsZXhcbiAgICogaXQncyBsaWtlbHkgeW91IHdhbnQgc2V0dXBUU1ZGUyBpbnN0ZWFkIGFuZCBjYW4gcHVsbCBwcm9ncmFtIG91dCBmcm9tIHRoYXRcbiAgICpcbiAgICogV2FybmluZzogUnVucyBvbiB0aGUgbWFpbiB0aHJlYWRcbiAgICovXG4gIGNvbnN0IGNyZWF0ZVRTUHJvZ3JhbSA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB0c3ZmcyA9IGF3YWl0IHNldHVwVFNWRlMoKVxuICAgIHJldHVybiB0c3Zmcy5wcm9ncmFtXG4gIH1cblxuICBjb25zdCBnZXRBU1QgPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgcHJvZ3JhbSA9IGF3YWl0IGNyZWF0ZVRTUHJvZ3JhbSgpXG4gICAgcHJvZ3JhbS5lbWl0KClcbiAgICByZXR1cm4gcHJvZ3JhbS5nZXRTb3VyY2VGaWxlKGZpbGVQYXRoLnBhdGgpIVxuICB9XG5cbiAgLy8gUGFzcyBhbG9uZyB0aGUgc3VwcG9ydGVkIHJlbGVhc2VzIGZvciB0aGUgcGxheWdyb3VuZFxuICBjb25zdCBzdXBwb3J0ZWRWZXJzaW9ucyA9IHN1cHBvcnRlZFJlbGVhc2VzXG5cbiAgdGV4dFVwZGF0ZWQoKVxuXG4gIHJldHVybiB7XG4gICAgLyoqIFRoZSBzYW1lIGNvbmZpZyB5b3UgcGFzc2VkIGluICovXG4gICAgY29uZmlnLFxuICAgIC8qKiBBIGxpc3Qgb2YgVHlwZVNjcmlwdCB2ZXJzaW9ucyB5b3UgY2FuIHVzZSB3aXRoIHRoZSBUeXBlU2NyaXB0IHNhbmRib3ggKi9cbiAgICBzdXBwb3J0ZWRWZXJzaW9ucyxcbiAgICAvKiogVGhlIG1vbmFjbyBlZGl0b3IgaW5zdGFuY2UgKi9cbiAgICBlZGl0b3IsXG4gICAgLyoqIEVpdGhlciBcInR5cGVzY3JpcHRcIiBvciBcImphdmFzY3JpcHRcIiBkZXBlbmRpbmcgb24geW91ciBjb25maWcgKi9cbiAgICBsYW5ndWFnZSxcbiAgICAvKiogVGhlIG91dGVyIG1vbmFjbyBtb2R1bGUsIHRoZSByZXN1bHQgb2YgcmVxdWlyZShcIm1vbmFjby1lZGl0b3JcIikgICovXG4gICAgbW9uYWNvLFxuICAgIC8qKiBHZXRzIGEgbW9uYWNvLXR5cGVzY3JpcHQgd29ya2VyLCB0aGlzIHdpbGwgZ2l2ZSB5b3UgYWNjZXNzIHRvIGEgbGFuZ3VhZ2Ugc2VydmVyLiBOb3RlOiBwcmVmZXIgdGhpcyBmb3IgbGFuZ3VhZ2Ugc2VydmVyIHdvcmsgYmVjYXVzZSBpdCBoYXBwZW5zIG9uIGEgd2Vid29ya2VyIC4gKi9cbiAgICBnZXRXb3JrZXJQcm9jZXNzLFxuICAgIC8qKiBBIGNvcHkgb2YgcmVxdWlyZShcIkB0eXBlc2NyaXB0L3Zmc1wiKSB0aGlzIGNhbiBiZSB1c2VkIHRvIHF1aWNrbHkgc2V0IHVwIGFuIGluLW1lbW9yeSBjb21waWxlciBydW5zIGZvciBBU1RzLCBvciB0byBnZXQgY29tcGxleCBsYW5ndWFnZSBzZXJ2ZXIgcmVzdWx0cyAoYW55dGhpbmcgYWJvdmUgaGFzIHRvIGJlIHNlcmlhbGl6ZWQgd2hlbiBwYXNzZWQpKi9cbiAgICB0c3ZmcyxcbiAgICAvKiogR2V0IGFsbCB0aGUgZGlmZmVyZW50IGVtaXR0ZWQgZmlsZXMgYWZ0ZXIgVHlwZVNjcmlwdCBpcyBydW4gKi9cbiAgICBnZXRFbWl0UmVzdWx0LFxuICAgIC8qKiBHZXRzIGp1c3QgdGhlIEphdmFTY3JpcHQgZm9yIHlvdXIgc2FuZGJveCwgd2lsbCB0cmFuc3BpbGUgaWYgaW4gVFMgb25seSAqL1xuICAgIGdldFJ1bm5hYmxlSlMsXG4gICAgLyoqIEdldHMgdGhlIERUUyBvdXRwdXQgb2YgdGhlIG1haW4gY29kZSBpbiB0aGUgZWRpdG9yICovXG4gICAgZ2V0RFRTRm9yQ29kZSxcbiAgICAvKiogVGhlIG1vbmFjby1lZGl0b3IgZG9tIG5vZGUsIHVzZWQgZm9yIHNob3dpbmcvaGlkaW5nIHRoZSBlZGl0b3IgKi9cbiAgICBnZXREb21Ob2RlLFxuICAgIC8qKiBUaGUgbW9kZWwgaXMgYW4gb2JqZWN0IHdoaWNoIG1vbmFjbyB1c2VzIHRvIGtlZXAgdHJhY2sgb2YgdGV4dCBpbiB0aGUgZWRpdG9yLiBVc2UgdGhpcyB0byBkaXJlY3RseSBtb2RpZnkgdGhlIHRleHQgaW4gdGhlIGVkaXRvciAqL1xuICAgIGdldE1vZGVsLFxuICAgIC8qKiBHZXRzIHRoZSB0ZXh0IG9mIHRoZSBtYWluIG1vZGVsLCB3aGljaCBpcyB0aGUgdGV4dCBpbiB0aGUgZWRpdG9yICovXG4gICAgZ2V0VGV4dCxcbiAgICAvKiogU2hvcnRjdXQgZm9yIHNldHRpbmcgdGhlIG1vZGVsJ3MgdGV4dCBjb250ZW50IHdoaWNoIHdvdWxkIHVwZGF0ZSB0aGUgZWRpdG9yICovXG4gICAgc2V0VGV4dCxcbiAgICAvKiogR2V0cyB0aGUgQVNUIG9mIHRoZSBjdXJyZW50IHRleHQgaW4gbW9uYWNvIC0gdXNlcyBgY3JlYXRlVFNQcm9ncmFtYCwgc28gdGhlIHBlcmZvcm1hbmNlIGNhdmVhdCBhcHBsaWVzIHRoZXJlIHRvbyAqL1xuICAgIGdldEFTVCxcbiAgICAvKiogVGhlIG1vZHVsZSB5b3UgZ2V0IGZyb20gcmVxdWlyZShcInR5cGVzY3JpcHRcIikgKi9cbiAgICB0cyxcbiAgICAvKiogQ3JlYXRlIGEgbmV3IFByb2dyYW0sIGEgVHlwZVNjcmlwdCBkYXRhIG1vZGVsIHdoaWNoIHJlcHJlc2VudHMgdGhlIGVudGlyZSBwcm9qZWN0LiBBcyB3ZWxsIGFzIHNvbWUgb2YgdGhlXG4gICAgICogcHJpbWl0aXZlIG9iamVjdHMgeW91IHdvdWxkIG5vcm1hbGx5IG5lZWQgdG8gZG8gd29yayB3aXRoIHRoZSBmaWxlcy5cbiAgICAgKlxuICAgICAqIFRoZSBmaXJzdCB0aW1lIHRoaXMgaXMgY2FsbGVkIGl0IGhhcyB0byBkb3dubG9hZCBhbGwgdGhlIERUUyBmaWxlcyB3aGljaCBpcyBuZWVkZWQgZm9yIGFuIGV4YWN0IGNvbXBpbGVyIHJ1bi4gV2hpY2hcbiAgICAgKiBhdCBtYXggaXMgYWJvdXQgMS41TUIgLSBhZnRlciB0aGF0IHN1YnNlcXVlbnQgZG93bmxvYWRzIG9mIGR0cyBsaWIgZmlsZXMgY29tZSBmcm9tIGxvY2FsU3RvcmFnZS5cbiAgICAgKlxuICAgICAqIFRyeSB0byB1c2UgdGhpcyBzcGFyaW5nbHkgYXMgaXQgY2FuIGJlIGNvbXB1dGF0aW9uYWxseSBleHBlbnNpdmUsIGF0IHRoZSBtaW5pbXVtIHlvdSBzaG91bGQgYmUgdXNpbmcgdGhlIGRlYm91bmNlZCBzZXR1cC5cbiAgICAgKlxuICAgICAqIEFjY2VwdHMgYW4gb3B0aW9uYWwgZnNNYXAgd2hpY2ggeW91IGNhbiB1c2UgdG8gYWRkIGFueSBmaWxlcywgb3Igb3ZlcndyaXRlIHRoZSBkZWZhdWx0IGZpbGUuXG4gICAgICpcbiAgICAgKiBUT0RPOiBJdCB3b3VsZCBiZSBnb29kIHRvIGNyZWF0ZSBhbiBlYXN5IHdheSB0byBoYXZlIGEgc2luZ2xlIHByb2dyYW0gaW5zdGFuY2Ugd2hpY2ggaXMgdXBkYXRlZCBmb3IgeW91XG4gICAgICogd2hlbiB0aGUgbW9uYWNvIG1vZGVsIGNoYW5nZXMuXG4gICAgICovXG4gICAgc2V0dXBUU1ZGUyxcbiAgICAvKiogVXNlcyB0aGUgYWJvdmUgY2FsbCBzZXR1cFRTVkZTLCBidXQgb25seSByZXR1cm5zIHRoZSBwcm9ncmFtICovXG4gICAgY3JlYXRlVFNQcm9ncmFtLFxuICAgIC8qKiBUaGUgU2FuZGJveCdzIGRlZmF1bHQgY29tcGlsZXIgb3B0aW9ucyAgKi9cbiAgICBjb21waWxlckRlZmF1bHRzLFxuICAgIC8qKiBUaGUgU2FuZGJveCdzIGN1cnJlbnQgY29tcGlsZXIgb3B0aW9ucyAqL1xuICAgIGdldENvbXBpbGVyT3B0aW9ucyxcbiAgICAvKiogUmVwbGFjZSB0aGUgU2FuZGJveCdzIGNvbXBpbGVyIG9wdGlvbnMgKi9cbiAgICBzZXRDb21waWxlclNldHRpbmdzLFxuICAgIC8qKiBPdmVyd3JpdGUgdGhlIFNhbmRib3gncyBjb21waWxlciBvcHRpb25zICovXG4gICAgdXBkYXRlQ29tcGlsZXJTZXR0aW5nLFxuICAgIC8qKiBVcGRhdGUgYSBzaW5nbGUgY29tcGlsZXIgb3B0aW9uIGluIHRoZSBTQW5kYm94ICovXG4gICAgdXBkYXRlQ29tcGlsZXJTZXR0aW5ncyxcbiAgICAvKiogQSB3YXkgdG8gZ2V0IGNhbGxiYWNrcyB3aGVuIGNvbXBpbGVyIHNldHRpbmdzIGhhdmUgY2hhbmdlZCAqL1xuICAgIHNldERpZFVwZGF0ZUNvbXBpbGVyU2V0dGluZ3MsXG4gICAgLyoqIEEgY29weSBvZiBsenN0cmluZywgd2hpY2ggaXMgdXNlZCB0byBhcmNoaXZlL3VuYXJjaGl2ZSBjb2RlICovXG4gICAgbHpzdHJpbmcsXG4gICAgLyoqIFJldHVybnMgY29tcGlsZXIgb3B0aW9ucyBmb3VuZCBpbiB0aGUgcGFyYW1zIG9mIHRoZSBjdXJyZW50IHBhZ2UgKi9cbiAgICBjcmVhdGVVUkxRdWVyeVdpdGhDb21waWxlck9wdGlvbnMsXG4gICAgLyoqXG4gICAgICogQGRlcHJlY2F0ZWQgVXNlIGBnZXRUd29TbGFzaENvbXBpbGVyT3B0aW9uc2AgaW5zdGVhZC5cbiAgICAgKlxuICAgICAqIFJldHVybnMgY29tcGlsZXIgb3B0aW9ucyBpbiB0aGUgc291cmNlIGNvZGUgdXNpbmcgdHdvc2xhc2ggbm90YXRpb25cbiAgICAgKi9cbiAgICBnZXRUd29TbGFzaENvbXBsaWVyT3B0aW9uczogZ2V0VHdvU2xhc2hDb21waWxlck9wdGlvbnMsXG4gICAgLyoqIFJldHVybnMgY29tcGlsZXIgb3B0aW9ucyBpbiB0aGUgc291cmNlIGNvZGUgdXNpbmcgdHdvc2xhc2ggbm90YXRpb24gKi9cbiAgICBnZXRUd29TbGFzaENvbXBpbGVyT3B0aW9ucyxcbiAgICAvKiogR2V0cyB0byB0aGUgY3VycmVudCBtb25hY28tbGFuZ3VhZ2UsIHRoaXMgaXMgaG93IHlvdSB0YWxrIHRvIHRoZSBiYWNrZ3JvdW5kIHdlYndvcmtlcnMgKi9cbiAgICBsYW5ndWFnZVNlcnZpY2VEZWZhdWx0czogZGVmYXVsdHMsXG4gICAgLyoqIFRoZSBwYXRoIHdoaWNoIHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgZmlsZSB1c2luZyB0aGUgY3VycmVudCBjb21waWxlciBvcHRpb25zICovXG4gICAgZmlsZXBhdGg6IGZpbGVQYXRoLnBhdGgsXG4gICAgLyoqIEFkZHMgYSBmaWxlIHRvIHRoZSB2ZnMgdXNlZCBieSB0aGUgZWRpdG9yICovXG4gICAgYWRkTGlicmFyeVRvUnVudGltZSxcbiAgfVxufVxuXG5leHBvcnQgdHlwZSBTYW5kYm94ID0gUmV0dXJuVHlwZTx0eXBlb2YgY3JlYXRlVHlwZVNjcmlwdFNhbmRib3g+XG4iXX0=
