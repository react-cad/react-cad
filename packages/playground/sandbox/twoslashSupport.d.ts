declare type TS = typeof import("typescript");
/**
 * This is a port of the twoslash bit which grabs compiler options
 * from the source code
 */
export declare const extractTwoSlashCompilerOptions: (
  ts: TS
) => (code: string) => any;
export declare function parsePrimitive(value: string, type: string): any;
export declare const twoslashCompletions: (
  ts: TS,
  monaco: typeof import("monaco-editor")
) => (
  model: import("monaco-editor").editor.ITextModel,
  position: import("monaco-editor").Position,
  _token: any
) => import("monaco-editor").languages.CompletionList;
export {};
