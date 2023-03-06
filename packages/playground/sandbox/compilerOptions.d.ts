import { SandboxConfig } from ".";
declare type CompilerOptions = import("monaco-editor").languages.typescript.CompilerOptions;
declare type Monaco = typeof import("monaco-editor");
/**
 * These are the defaults, but they also act as the list of all compiler options
 * which are parsed in the query params.
 */
export declare function getDefaultSandboxCompilerOptions(
  config: SandboxConfig,
  monaco: Monaco
): {
  [
    x: string
  ]: import("monaco-editor").languages.typescript.CompilerOptionsValue;
  allowJs?: boolean | undefined;
  allowSyntheticDefaultImports?: boolean | undefined;
  allowUmdGlobalAccess?: boolean | undefined;
  allowUnreachableCode?: boolean | undefined;
  allowUnusedLabels?: boolean | undefined;
  alwaysStrict?: boolean | undefined;
  baseUrl?: string | undefined;
  charset?: string | undefined;
  checkJs?: boolean | undefined;
  declaration?: boolean | undefined;
  declarationMap?: boolean | undefined;
  emitDeclarationOnly?: boolean | undefined;
  declarationDir?: string | undefined;
  disableSizeLimit?: boolean | undefined;
  disableSourceOfProjectReferenceRedirect?: boolean | undefined;
  downlevelIteration?: boolean | undefined;
  emitBOM?: boolean | undefined;
  emitDecoratorMetadata?: boolean | undefined;
  experimentalDecorators?: boolean | undefined;
  forceConsistentCasingInFileNames?: boolean | undefined;
  importHelpers?: boolean | undefined;
  inlineSourceMap?: boolean | undefined;
  inlineSources?: boolean | undefined;
  isolatedModules?: boolean | undefined;
  jsx?: import("monaco-editor").languages.typescript.JsxEmit | undefined;
  keyofStringsOnly?: boolean | undefined;
  lib?: string[] | undefined;
  locale?: string | undefined;
  mapRoot?: string | undefined;
  maxNodeModuleJsDepth?: number | undefined;
  module?: import("monaco-editor").languages.typescript.ModuleKind | undefined;
  moduleResolution?:
    | import("monaco-editor").languages.typescript.ModuleResolutionKind
    | undefined;
  newLine?:
    | import("monaco-editor").languages.typescript.NewLineKind
    | undefined;
  noEmit?: boolean | undefined;
  noEmitHelpers?: boolean | undefined;
  noEmitOnError?: boolean | undefined;
  noErrorTruncation?: boolean | undefined;
  noFallthroughCasesInSwitch?: boolean | undefined;
  noImplicitAny?: boolean | undefined;
  noImplicitReturns?: boolean | undefined;
  noImplicitThis?: boolean | undefined;
  noStrictGenericChecks?: boolean | undefined;
  noUnusedLocals?: boolean | undefined;
  noUnusedParameters?: boolean | undefined;
  noImplicitUseStrict?: boolean | undefined;
  noLib?: boolean | undefined;
  noResolve?: boolean | undefined;
  out?: string | undefined;
  outDir?: string | undefined;
  outFile?: string | undefined;
  paths?:
    | import("monaco-editor").languages.typescript.MapLike<string[]>
    | undefined;
  preserveConstEnums?: boolean | undefined;
  preserveSymlinks?: boolean | undefined;
  project?: string | undefined;
  reactNamespace?: string | undefined;
  jsxFactory?: string | undefined;
  composite?: boolean | undefined;
  removeComments?: boolean | undefined;
  rootDir?: string | undefined;
  rootDirs?: string[] | undefined;
  skipLibCheck?: boolean | undefined;
  skipDefaultLibCheck?: boolean | undefined;
  sourceMap?: boolean | undefined;
  sourceRoot?: string | undefined;
  strict?: boolean | undefined;
  strictFunctionTypes?: boolean | undefined;
  strictBindCallApply?: boolean | undefined;
  strictNullChecks?: boolean | undefined;
  strictPropertyInitialization?: boolean | undefined;
  stripInternal?: boolean | undefined;
  suppressExcessPropertyErrors?: boolean | undefined;
  suppressImplicitAnyIndexErrors?: boolean | undefined;
  target?:
    | import("monaco-editor").languages.typescript.ScriptTarget
    | undefined;
  traceResolution?: boolean | undefined;
  resolveJsonModule?: boolean | undefined;
  types?: string[] | undefined;
  typeRoots?: string[] | undefined;
  esModuleInterop?: boolean | undefined;
  useDefineForClassFields?: boolean | undefined;
};
/**
 * Loop through all of the entries in the existing compiler options then compare them with the
 * query params and return an object which is the changed settings via the query params
 */
export declare const getCompilerOptionsFromParams: (
  playgroundDefaults: CompilerOptions,
  ts: typeof import("typescript"),
  params: URLSearchParams
) => CompilerOptions;
/** Gets a query string representation (hash + queries) */
export declare const createURLQueryWithCompilerOptions: (
  _sandbox: any,
  paramOverrides?: any
) => string;
export {};
