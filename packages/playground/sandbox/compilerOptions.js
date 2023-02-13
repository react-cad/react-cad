define(["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.createURLQueryWithCompilerOptions = exports.getCompilerOptionsFromParams = exports.getDefaultSandboxCompilerOptions = void 0;
  /**
   * These are the defaults, but they also act as the list of all compiler options
   * which are parsed in the query params.
   */
  function getDefaultSandboxCompilerOptions(config, monaco) {
    const useJavaScript = config.filetype === "js";
    const settings = {
      strict: true,
      noImplicitAny: true,
      strictNullChecks: !useJavaScript,
      strictFunctionTypes: true,
      strictPropertyInitialization: true,
      strictBindCallApply: true,
      noImplicitThis: true,
      noImplicitReturns: true,
      noUncheckedIndexedAccess: false,
      // 3.7 off, 3.8 on I think
      useDefineForClassFields: false,
      alwaysStrict: true,
      allowUnreachableCode: false,
      allowUnusedLabels: false,
      downlevelIteration: false,
      noEmitHelpers: false,
      noLib: false,
      noStrictGenericChecks: false,
      noUnusedLocals: false,
      noUnusedParameters: false,
      esModuleInterop: true,
      preserveConstEnums: false,
      removeComments: false,
      skipLibCheck: false,
      checkJs: useJavaScript,
      allowJs: useJavaScript,
      declaration: true,
      importHelpers: false,
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      target: monaco.languages.typescript.ScriptTarget.ES2017,
      jsx: monaco.languages.typescript.JsxEmit.React,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    };
    return Object.assign(Object.assign({}, settings), config.compilerOptions);
  }
  exports.getDefaultSandboxCompilerOptions = getDefaultSandboxCompilerOptions;
  /**
   * Loop through all of the entries in the existing compiler options then compare them with the
   * query params and return an object which is the changed settings via the query params
   */
  const getCompilerOptionsFromParams = (playgroundDefaults, ts, params) => {
    const returnedOptions = {};
    params.forEach((val, key) => {
      // First use the defaults object to drop compiler flags which are already set to the default
      if (playgroundDefaults[key]) {
        let toSet = undefined;
        if (val === "true" && playgroundDefaults[key] !== true) {
          toSet = true;
        } else if (val === "false" && playgroundDefaults[key] !== false) {
          toSet = false;
        } else if (
          !isNaN(parseInt(val, 10)) &&
          playgroundDefaults[key] !== parseInt(val, 10)
        ) {
          toSet = parseInt(val, 10);
        }
        if (toSet !== undefined) returnedOptions[key] = toSet;
      } else {
        // If that doesn't work, double check that the flag exists and allow it through
        // @ts-ignore
        const flagExists = ts.optionDeclarations.find(
          (opt) => opt.name === key
        );
        if (flagExists) {
          let realValue = true;
          if (val === "false") realValue = false;
          if (!isNaN(parseInt(val, 10))) realValue = parseInt(val, 10);
          returnedOptions[key] = realValue;
        }
      }
    });
    return returnedOptions;
  };
  exports.getCompilerOptionsFromParams = getCompilerOptionsFromParams;
  // Can't set sandbox to be the right type because the param would contain this function
  /** Gets a query string representation (hash + queries) */
  const createURLQueryWithCompilerOptions = (_sandbox, paramOverrides) => {
    const sandbox = _sandbox;
    const initialOptions = new URLSearchParams(document.location.search);
    const compilerOptions = sandbox.getCompilerOptions();
    const compilerDefaults = sandbox.compilerDefaults;
    const diff = Object.entries(compilerOptions).reduce((acc, [key, value]) => {
      if (value !== compilerDefaults[key]) {
        // @ts-ignore
        acc[key] = compilerOptions[key];
      }
      return acc;
    }, {});
    // The text of the TS/JS as the hash
    const hash = `code/${sandbox.lzstring.compressToEncodedURIComponent(
      sandbox.getText()
    )}`;
    let urlParams = Object.assign({}, diff);
    for (const param of ["lib", "ts"]) {
      const params = new URLSearchParams(location.search);
      if (params.has(param)) {
        // Special case the nightly where it uses the TS version to hardcode
        // the nightly build
        if (
          param === "ts" &&
          (params.get(param) === "Nightly" || params.get(param) === "next")
        ) {
          urlParams["ts"] = sandbox.ts.version;
        } else {
          urlParams["ts"] = params.get(param);
        }
      }
    }
    // Support sending the selection, but only if there is a selection, and it's not the whole thing
    const s = sandbox.editor.getSelection();
    const isNotEmpty =
      (s && s.selectionStartLineNumber !== s.positionLineNumber) ||
      (s && s.selectionStartColumn !== s.positionColumn);
    const range = sandbox.editor.getModel().getFullModelRange();
    const isFull =
      s &&
      s.selectionStartLineNumber === range.startLineNumber &&
      s.selectionStartColumn === range.startColumn &&
      s.positionColumn === range.endColumn &&
      s.positionLineNumber === range.endLineNumber;
    if (s && isNotEmpty && !isFull) {
      urlParams["ssl"] = s.selectionStartLineNumber;
      urlParams["ssc"] = s.selectionStartColumn;
      urlParams["pln"] = s.positionLineNumber;
      urlParams["pc"] = s.positionColumn;
    } else {
      urlParams["ssl"] = undefined;
      urlParams["ssc"] = undefined;
      urlParams["pln"] = undefined;
      urlParams["pc"] = undefined;
    }
    if (sandbox.config.filetype !== "ts")
      urlParams["filetype"] = sandbox.config.filetype;
    if (paramOverrides) {
      urlParams = Object.assign(Object.assign({}, urlParams), paramOverrides);
    }
    // @ts-ignore - this is in MDN but not libdom
    const hasInitialOpts = initialOptions.keys().length > 0;
    if (Object.keys(urlParams).length > 0 || hasInitialOpts) {
      let queryString = Object.entries(urlParams)
        .filter(([_k, v]) => v !== undefined)
        .filter(([_k, v]) => v !== null)
        .map(([key, value]) => {
          return `${key}=${encodeURIComponent(value)}`;
        })
        .join("&");
      // We want to keep around custom query variables, which
      // are usually used by playground plugins, with the exception
      // being the install-plugin param and any compiler options
      // which have a default value
      initialOptions.forEach((value, key) => {
        const skip = ["ssl", "ssc", "pln", "pc"];
        if (skip.includes(key)) return;
        if (queryString.includes(key)) return;
        if (compilerOptions[key]) return;
        queryString += `&${key}=${value}`;
      });
      return `?${queryString}#${hash}`;
    } else {
      return `#${hash}`;
    }
  };
  exports.createURLQueryWithCompilerOptions = createURLQueryWithCompilerOptions;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJPcHRpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc2FuZGJveC9zcmMvY29tcGlsZXJPcHRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7SUFLQTs7O09BR0c7SUFDSCxTQUFnQixnQ0FBZ0MsQ0FBQyxNQUFxQixFQUFFLE1BQWM7UUFDcEYsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUE7UUFDOUMsTUFBTSxRQUFRLEdBQW9CO1lBQ2hDLE1BQU0sRUFBRSxJQUFJO1lBRVosYUFBYSxFQUFFLElBQUk7WUFDbkIsZ0JBQWdCLEVBQUUsQ0FBQyxhQUFhO1lBQ2hDLG1CQUFtQixFQUFFLElBQUk7WUFDekIsNEJBQTRCLEVBQUUsSUFBSTtZQUNsQyxtQkFBbUIsRUFBRSxJQUFJO1lBQ3pCLGNBQWMsRUFBRSxJQUFJO1lBQ3BCLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsd0JBQXdCLEVBQUUsS0FBSztZQUUvQiwwQkFBMEI7WUFDMUIsdUJBQXVCLEVBQUUsS0FBSztZQUU5QixZQUFZLEVBQUUsSUFBSTtZQUNsQixvQkFBb0IsRUFBRSxLQUFLO1lBQzNCLGlCQUFpQixFQUFFLEtBQUs7WUFFeEIsa0JBQWtCLEVBQUUsS0FBSztZQUN6QixhQUFhLEVBQUUsS0FBSztZQUNwQixLQUFLLEVBQUUsS0FBSztZQUNaLHFCQUFxQixFQUFFLEtBQUs7WUFDNUIsY0FBYyxFQUFFLEtBQUs7WUFDckIsa0JBQWtCLEVBQUUsS0FBSztZQUV6QixlQUFlLEVBQUUsSUFBSTtZQUNyQixrQkFBa0IsRUFBRSxLQUFLO1lBQ3pCLGNBQWMsRUFBRSxLQUFLO1lBQ3JCLFlBQVksRUFBRSxLQUFLO1lBRW5CLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLE9BQU8sRUFBRSxhQUFhO1lBQ3RCLFdBQVcsRUFBRSxJQUFJO1lBRWpCLGFBQWEsRUFBRSxLQUFLO1lBRXBCLHNCQUFzQixFQUFFLElBQUk7WUFD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LEVBQUU7Z0JBQ3BDLE1BQU0sSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUE7Z0JBQ3hDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUM7b0JBQUUsT0FBTTtnQkFDOUIsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQztvQkFBRSxPQUFNO2dCQUNyQyxJQUFJLGVBQWUsQ0FBQyxHQUFHLENBQUM7b0JBQUUsT0FBTTtnQkFFaEMsV0FBVyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFBO1lBQ25DLENBQUMsQ0FBQyxDQUFBO1lBRUYsT0FBTyxJQUFJLFdBQVcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtTQUNqQzthQUFNO1lBQ0wsT0FBTyxJQUFJLElBQUksRUFBRSxDQUFBO1NBQ2xCO0lBQ0gsQ0FBQyxDQUFBO0lBOUZZLFFBQUEsaUNBQWlDLHFDQThGN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTYW5kYm94Q29uZmlnIH0gZnJvbSBcIi5cIlxuXG50eXBlIENvbXBpbGVyT3B0aW9ucyA9IGltcG9ydChcIm1vbmFjby1lZGl0b3JcIikubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuQ29tcGlsZXJPcHRpb25zXG50eXBlIE1vbmFjbyA9IHR5cGVvZiBpbXBvcnQoXCJtb25hY28tZWRpdG9yXCIpXG5cbi8qKlxuICogVGhlc2UgYXJlIHRoZSBkZWZhdWx0cywgYnV0IHRoZXkgYWxzbyBhY3QgYXMgdGhlIGxpc3Qgb2YgYWxsIGNvbXBpbGVyIG9wdGlvbnNcbiAqIHdoaWNoIGFyZSBwYXJzZWQgaW4gdGhlIHF1ZXJ5IHBhcmFtcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRTYW5kYm94Q29tcGlsZXJPcHRpb25zKGNvbmZpZzogU2FuZGJveENvbmZpZywgbW9uYWNvOiBNb25hY28pIHtcbiAgY29uc3QgdXNlSmF2YVNjcmlwdCA9IGNvbmZpZy5maWxldHlwZSA9PT0gXCJqc1wiXG4gIGNvbnN0IHNldHRpbmdzOiBDb21waWxlck9wdGlvbnMgPSB7XG4gICAgc3RyaWN0OiB0cnVlLFxuXG4gICAgbm9JbXBsaWNpdEFueTogdHJ1ZSxcbiAgICBzdHJpY3ROdWxsQ2hlY2tzOiAhdXNlSmF2YVNjcmlwdCxcbiAgICBzdHJpY3RGdW5jdGlvblR5cGVzOiB0cnVlLFxuICAgIHN0cmljdFByb3BlcnR5SW5pdGlhbGl6YXRpb246IHRydWUsXG4gICAgc3RyaWN0QmluZENhbGxBcHBseTogdHJ1ZSxcbiAgICBub0ltcGxpY2l0VGhpczogdHJ1ZSxcbiAgICBub0ltcGxpY2l0UmV0dXJuczogdHJ1ZSxcbiAgICBub1VuY2hlY2tlZEluZGV4ZWRBY2Nlc3M6IGZhbHNlLFxuXG4gICAgLy8gMy43IG9mZiwgMy44IG9uIEkgdGhpbmtcbiAgICB1c2VEZWZpbmVGb3JDbGFzc0ZpZWxkczogZmFsc2UsXG5cbiAgICBhbHdheXNTdHJpY3Q6IHRydWUsXG4gICAgYWxsb3dVbnJlYWNoYWJsZUNvZGU6IGZhbHNlLFxuICAgIGFsbG93VW51c2VkTGFiZWxzOiBmYWxzZSxcblxuICAgIGRvd25sZXZlbEl0ZXJhdGlvbjogZmFsc2UsXG4gICAgbm9FbWl0SGVscGVyczogZmFsc2UsXG4gICAgbm9MaWI6IGZhbHNlLFxuICAgIG5vU3RyaWN0R2VuZXJpY0NoZWNrczogZmFsc2UsXG4gICAgbm9VbnVzZWRMb2NhbHM6IGZhbHNlLFxuICAgIG5vVW51c2VkUGFyYW1ldGVyczogZmFsc2UsXG5cbiAgICBlc01vZHVsZUludGVyb3A6IHRydWUsXG4gICAgcHJlc2VydmVDb25zdEVudW1zOiBmYWxzZSxcbiAgICByZW1vdmVDb21tZW50czogZmFsc2UsXG4gICAgc2tpcExpYkNoZWNrOiBmYWxzZSxcblxuICAgIGNoZWNrSnM6IHVzZUphdmFTY3JpcHQsXG4gICAgYWxsb3dKczogdXNlSmF2YVNjcmlwdCxcbiAgICBkZWNsYXJhdGlvbjogdHJ1ZSxcblxuICAgIGltcG9ydEhlbHBlcnM6IGZhbHNlLFxuXG4gICAgZXhwZXJpbWVudGFsRGVjb3JhdG9yczogdHJ1ZSxcbiAgICBlbWl0RGVjb3JhdG9yTWV0YWRhdGE6IHRydWUsXG4gICAgbW9kdWxlUmVzb2x1dGlvbjogbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0Lk1vZHVsZVJlc29sdXRpb25LaW5kLk5vZGVKcyxcblxuICAgIHRhcmdldDogbW9uYWNvLmxhbmd1YWdlcy50eXBlc2NyaXB0LlNjcmlwdFRhcmdldC5FUzIwMTcsXG4gICAganN4OiBtb25hY28ubGFuZ3VhZ2VzLnR5cGVzY3JpcHQuSnN4RW1pdC5SZWFjdCxcbiAgICBtb2R1bGU6IG1vbmFjby5sYW5ndWFnZXMudHlwZXNjcmlwdC5Nb2R1bGVLaW5kLkVTTmV4dCxcbiAgfVxuXG4gIHJldHVybiB7IC4uLnNldHRpbmdzLCAuLi5jb25maWcuY29tcGlsZXJPcHRpb25zIH1cbn1cblxuLyoqXG4gKiBMb29wIHRocm91Z2ggYWxsIG9mIHRoZSBlbnRyaWVzIGluIHRoZSBleGlzdGluZyBjb21waWxlciBvcHRpb25zIHRoZW4gY29tcGFyZSB0aGVtIHdpdGggdGhlXG4gKiBxdWVyeSBwYXJhbXMgYW5kIHJldHVybiBhbiBvYmplY3Qgd2hpY2ggaXMgdGhlIGNoYW5nZWQgc2V0dGluZ3MgdmlhIHRoZSBxdWVyeSBwYXJhbXNcbiAqL1xuZXhwb3J0IGNvbnN0IGdldENvbXBpbGVyT3B0aW9uc0Zyb21QYXJhbXMgPSAoXG4gIHBsYXlncm91bmREZWZhdWx0czogQ29tcGlsZXJPcHRpb25zLFxuICB0czogdHlwZW9mIGltcG9ydChcInR5cGVzY3JpcHRcIiksXG4gIHBhcmFtczogVVJMU2VhcmNoUGFyYW1zXG4pOiBDb21waWxlck9wdGlvbnMgPT4ge1xuICBjb25zdCByZXR1cm5lZE9wdGlvbnM6IENvbXBpbGVyT3B0aW9ucyA9IHt9XG5cbiAgcGFyYW1zLmZvckVhY2goKHZhbCwga2V5KSA9PiB7XG4gICAgLy8gRmlyc3QgdXNlIHRoZSBkZWZhdWx0cyBvYmplY3QgdG8gZHJvcCBjb21waWxlciBmbGFncyB3aGljaCBhcmUgYWxyZWFkeSBzZXQgdG8gdGhlIGRlZmF1bHRcbiAgICBpZiAocGxheWdyb3VuZERlZmF1bHRzW2tleV0pIHtcbiAgICAgIGxldCB0b1NldCA9IHVuZGVmaW5lZFxuICAgICAgaWYgKHZhbCA9PT0gXCJ0cnVlXCIgJiYgcGxheWdyb3VuZERlZmF1bHRzW2tleV0gIT09IHRydWUpIHtcbiAgICAgICAgdG9TZXQgPSB0cnVlXG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PT0gXCJmYWxzZVwiICYmIHBsYXlncm91bmREZWZhdWx0c1trZXldICE9PSBmYWxzZSkge1xuICAgICAgICB0b1NldCA9IGZhbHNlXG4gICAgICB9IGVsc2UgaWYgKCFpc05hTihwYXJzZUludCh2YWwsIDEwKSkgJiYgcGxheWdyb3VuZERlZmF1bHRzW2tleV0gIT09IHBhcnNlSW50KHZhbCwgMTApKSB7XG4gICAgICAgIHRvU2V0ID0gcGFyc2VJbnQodmFsLCAxMClcbiAgICAgIH1cblxuICAgICAgaWYgKHRvU2V0ICE9PSB1bmRlZmluZWQpIHJldHVybmVkT3B0aW9uc1trZXldID0gdG9TZXRcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gSWYgdGhhdCBkb2Vzbid0IHdvcmssIGRvdWJsZSBjaGVjayB0aGF0IHRoZSBmbGFnIGV4aXN0cyBhbmQgYWxsb3cgaXQgdGhyb3VnaFxuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgY29uc3QgZmxhZ0V4aXN0cyA9IHRzLm9wdGlvbkRlY2xhcmF0aW9ucy5maW5kKG9wdCA9PiBvcHQubmFtZSA9PT0ga2V5KVxuICAgICAgaWYgKGZsYWdFeGlzdHMpIHtcbiAgICAgICAgbGV0IHJlYWxWYWx1ZTogbnVtYmVyIHwgYm9vbGVhbiA9IHRydWVcbiAgICAgICAgaWYgKHZhbCA9PT0gXCJmYWxzZVwiKSByZWFsVmFsdWUgPSBmYWxzZVxuICAgICAgICBpZiAoIWlzTmFOKHBhcnNlSW50KHZhbCwgMTApKSkgcmVhbFZhbHVlID0gcGFyc2VJbnQodmFsLCAxMClcbiAgICAgICAgcmV0dXJuZWRPcHRpb25zW2tleV0gPSByZWFsVmFsdWVcbiAgICAgIH1cbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIHJldHVybmVkT3B0aW9uc1xufVxuXG4vLyBDYW4ndCBzZXQgc2FuZGJveCB0byBiZSB0aGUgcmlnaHQgdHlwZSBiZWNhdXNlIHRoZSBwYXJhbSB3b3VsZCBjb250YWluIHRoaXMgZnVuY3Rpb25cblxuLyoqIEdldHMgYSBxdWVyeSBzdHJpbmcgcmVwcmVzZW50YXRpb24gKGhhc2ggKyBxdWVyaWVzKSAqL1xuZXhwb3J0IGNvbnN0IGNyZWF0ZVVSTFF1ZXJ5V2l0aENvbXBpbGVyT3B0aW9ucyA9IChfc2FuZGJveDogYW55LCBwYXJhbU92ZXJyaWRlcz86IGFueSk6IHN0cmluZyA9PiB7XG4gIGNvbnN0IHNhbmRib3ggPSBfc2FuZGJveCBhcyBpbXBvcnQoXCIuL2luZGV4XCIpLlNhbmRib3hcbiAgY29uc3QgaW5pdGlhbE9wdGlvbnMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGRvY3VtZW50LmxvY2F0aW9uLnNlYXJjaClcblxuICBjb25zdCBjb21waWxlck9wdGlvbnMgPSBzYW5kYm94LmdldENvbXBpbGVyT3B0aW9ucygpXG4gIGNvbnN0IGNvbXBpbGVyRGVmYXVsdHMgPSBzYW5kYm94LmNvbXBpbGVyRGVmYXVsdHNcbiAgY29uc3QgZGlmZiA9IE9iamVjdC5lbnRyaWVzKGNvbXBpbGVyT3B0aW9ucykucmVkdWNlKChhY2MsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgIGlmICh2YWx1ZSAhPT0gY29tcGlsZXJEZWZhdWx0c1trZXldKSB7XG4gICAgICAvLyBAdHMtaWdub3JlXG4gICAgICBhY2Nba2V5XSA9IGNvbXBpbGVyT3B0aW9uc1trZXldXG4gICAgfVxuXG4gICAgcmV0dXJuIGFjY1xuICB9LCB7fSlcblxuICAvLyBUaGUgdGV4dCBvZiB0aGUgVFMvSlMgYXMgdGhlIGhhc2hcbiAgY29uc3QgaGFzaCA9IGBjb2RlLyR7c2FuZGJveC5senN0cmluZy5jb21wcmVzc1RvRW5jb2RlZFVSSUNvbXBvbmVudChzYW5kYm94LmdldFRleHQoKSl9YFxuXG4gIGxldCB1cmxQYXJhbXM6IGFueSA9IE9iamVjdC5hc3NpZ24oe30sIGRpZmYpXG4gIGZvciAoY29uc3QgcGFyYW0gb2YgW1wibGliXCIsIFwidHNcIl0pIHtcbiAgICBjb25zdCBwYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKGxvY2F0aW9uLnNlYXJjaClcbiAgICBpZiAocGFyYW1zLmhhcyhwYXJhbSkpIHtcbiAgICAgIC8vIFNwZWNpYWwgY2FzZSB0aGUgbmlnaHRseSB3aGVyZSBpdCB1c2VzIHRoZSBUUyB2ZXJzaW9uIHRvIGhhcmRjb2RlXG4gICAgICAvLyB0aGUgbmlnaHRseSBidWlsZFxuICAgICAgaWYgKHBhcmFtID09PSBcInRzXCIgJiYgKHBhcmFtcy5nZXQocGFyYW0pID09PSBcIk5pZ2h0bHlcIiB8fCBwYXJhbXMuZ2V0KHBhcmFtKSA9PT0gXCJuZXh0XCIpKSB7XG4gICAgICAgIHVybFBhcmFtc1tcInRzXCJdID0gc2FuZGJveC50cy52ZXJzaW9uXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB1cmxQYXJhbXNbXCJ0c1wiXSA9IHBhcmFtcy5nZXQocGFyYW0pXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gU3VwcG9ydCBzZW5kaW5nIHRoZSBzZWxlY3Rpb24sIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIGEgc2VsZWN0aW9uLCBhbmQgaXQncyBub3QgdGhlIHdob2xlIHRoaW5nXG4gIGNvbnN0IHMgPSBzYW5kYm94LmVkaXRvci5nZXRTZWxlY3Rpb24oKVxuXG4gIGNvbnN0IGlzTm90RW1wdHkgPVxuICAgIChzICYmIHMuc2VsZWN0aW9uU3RhcnRMaW5lTnVtYmVyICE9PSBzLnBvc2l0aW9uTGluZU51bWJlcikgfHwgKHMgJiYgcy5zZWxlY3Rpb25TdGFydENvbHVtbiAhPT0gcy5wb3NpdGlvbkNvbHVtbilcblxuICBjb25zdCByYW5nZSA9IHNhbmRib3guZWRpdG9yLmdldE1vZGVsKCkhLmdldEZ1bGxNb2RlbFJhbmdlKClcbiAgY29uc3QgaXNGdWxsID1cbiAgICBzICYmXG4gICAgcy5zZWxlY3Rpb25TdGFydExpbmVOdW1iZXIgPT09IHJhbmdlLnN0YXJ0TGluZU51bWJlciAmJlxuICAgIHMuc2VsZWN0aW9uU3RhcnRDb2x1bW4gPT09IHJhbmdlLnN0YXJ0Q29sdW1uICYmXG4gICAgcy5wb3NpdGlvbkNvbHVtbiA9PT0gcmFuZ2UuZW5kQ29sdW1uICYmXG4gICAgcy5wb3NpdGlvbkxpbmVOdW1iZXIgPT09IHJhbmdlLmVuZExpbmVOdW1iZXJcblxuICBpZiAocyAmJiBpc05vdEVtcHR5ICYmICFpc0Z1bGwpIHtcbiAgICB1cmxQYXJhbXNbXCJzc2xcIl0gPSBzLnNlbGVjdGlvblN0YXJ0TGluZU51bWJlclxuICAgIHVybFBhcmFtc1tcInNzY1wiXSA9IHMuc2VsZWN0aW9uU3RhcnRDb2x1bW5cbiAgICB1cmxQYXJhbXNbXCJwbG5cIl0gPSBzLnBvc2l0aW9uTGluZU51bWJlclxuICAgIHVybFBhcmFtc1tcInBjXCJdID0gcy5wb3NpdGlvbkNvbHVtblxuICB9IGVsc2Uge1xuICAgIHVybFBhcmFtc1tcInNzbFwiXSA9IHVuZGVmaW5lZFxuICAgIHVybFBhcmFtc1tcInNzY1wiXSA9IHVuZGVmaW5lZFxuICAgIHVybFBhcmFtc1tcInBsblwiXSA9IHVuZGVmaW5lZFxuICAgIHVybFBhcmFtc1tcInBjXCJdID0gdW5kZWZpbmVkXG4gIH1cblxuICBpZiAoc2FuZGJveC5jb25maWcuZmlsZXR5cGUgIT09IFwidHNcIikgdXJsUGFyYW1zW1wiZmlsZXR5cGVcIl0gPSBzYW5kYm94LmNvbmZpZy5maWxldHlwZVxuXG4gIGlmIChwYXJhbU92ZXJyaWRlcykge1xuICAgIHVybFBhcmFtcyA9IHsgLi4udXJsUGFyYW1zLCAuLi5wYXJhbU92ZXJyaWRlcyB9XG4gIH1cblxuICAvLyBAdHMtaWdub3JlIC0gdGhpcyBpcyBpbiBNRE4gYnV0IG5vdCBsaWJkb21cbiAgY29uc3QgaGFzSW5pdGlhbE9wdHMgPSBpbml0aWFsT3B0aW9ucy5rZXlzKCkubGVuZ3RoID4gMFxuXG4gIGlmIChPYmplY3Qua2V5cyh1cmxQYXJhbXMpLmxlbmd0aCA+IDAgfHwgaGFzSW5pdGlhbE9wdHMpIHtcbiAgICBsZXQgcXVlcnlTdHJpbmcgPSBPYmplY3QuZW50cmllcyh1cmxQYXJhbXMpXG4gICAgICAuZmlsdGVyKChbX2ssIHZdKSA9PiB2ICE9PSB1bmRlZmluZWQpXG4gICAgICAuZmlsdGVyKChbX2ssIHZdKSA9PiB2ICE9PSBudWxsKVxuICAgICAgLm1hcCgoW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIHJldHVybiBgJHtrZXl9PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlIGFzIHN0cmluZyl9YFxuICAgICAgfSlcbiAgICAgIC5qb2luKFwiJlwiKVxuXG4gICAgLy8gV2Ugd2FudCB0byBrZWVwIGFyb3VuZCBjdXN0b20gcXVlcnkgdmFyaWFibGVzLCB3aGljaFxuICAgIC8vIGFyZSB1c3VhbGx5IHVzZWQgYnkgcGxheWdyb3VuZCBwbHVnaW5zLCB3aXRoIHRoZSBleGNlcHRpb25cbiAgICAvLyBiZWluZyB0aGUgaW5zdGFsbC1wbHVnaW4gcGFyYW0gYW5kIGFueSBjb21waWxlciBvcHRpb25zXG4gICAgLy8gd2hpY2ggaGF2ZSBhIGRlZmF1bHQgdmFsdWVcblxuICAgIGluaXRpYWxPcHRpb25zLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHtcbiAgICAgIGNvbnN0IHNraXAgPSBbXCJzc2xcIiwgXCJzc2NcIiwgXCJwbG5cIiwgXCJwY1wiXVxuICAgICAgaWYgKHNraXAuaW5jbHVkZXMoa2V5KSkgcmV0dXJuXG4gICAgICBpZiAocXVlcnlTdHJpbmcuaW5jbHVkZXMoa2V5KSkgcmV0dXJuXG4gICAgICBpZiAoY29tcGlsZXJPcHRpb25zW2tleV0pIHJldHVyblxuXG4gICAgICBxdWVyeVN0cmluZyArPSBgJiR7a2V5fT0ke3ZhbHVlfWBcbiAgICB9KVxuXG4gICAgcmV0dXJuIGA/JHtxdWVyeVN0cmluZ30jJHtoYXNofWBcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYCMke2hhc2h9YFxuICB9XG59XG4iXX0=
