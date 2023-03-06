export interface ATABootstrapConfig {
  /** A object you pass in to get callbacks */
  delegate: {
    /** The callback which gets called when ATA decides a file needs to be written to your VFS  */
    receivedFile?: (code: string, path: string) => void;
    /** A way to display progress */
    progress?: (downloaded: number, estimatedTotal: number) => void;
    /** Note: An error message does not mean ATA has stopped! */
    errorMessage?: (userFacingMessage: string, error: Error) => void;
    /** A callback indicating that ATA actually has work to do */
    started?: () => void;
    /** The callback when all ATA has finished */
    finished?: (files: Map<string, string>) => void;
  };
  /** Passed to fetch as the user-agent */
  projectName: string;
  /** Your local copy of typescript */
  typescript: typeof import("typescript");
  /** If you need a custom version of fetch */
  fetcher?: typeof fetch;
  /** If you need a custom logger instead of the console global */
  logger?: Logger;
}
declare type ModuleMeta = {
  state: "loading";
};
/**
 * The function which starts up type acquisition,
 * returns a function which you then pass the initial
 * source code for the app with.
 *
 * This is effectively the main export, everything else is
 * basically exported for tests and should be considered
 * implementation details by consumers.
 */
export declare const setupTypeAcquisition: (
  config: ATABootstrapConfig
) => (initialSourceFile: string) => void;
/**
 * Pull out any potential references to other modules (including relatives) with their
 * npm versioning strat too if someone opts into a different version via an inline end of line comment
 */
export declare const getReferencesForModule: (
  ts: typeof import("typescript"),
  code: string
) => {
  module: string;
  version: string | undefined;
}[];
/** A list of modules from the current sourcefile which we don't have existing files for */
export declare function getNewDependencies(
  config: ATABootstrapConfig,
  moduleMap: Map<string, ModuleMeta>,
  code: string
): {
  module: string;
  version: string | undefined;
}[];
/** The bulk load of the work in getting the filetree based on how people think about npm names and versions */
export declare const getFileTreeForModuleWithTag: (
  config: ATABootstrapConfig,
  moduleName: string,
  tag: string | undefined
) => Promise<
  | {
      moduleName: string;
      version: string;
      default: string;
      files: {
        name: string;
      }[];
    }
  | {
      error: Error;
      userFacingMessage: string;
    }
  | {
      error: {
        version: string | null;
      };
      userFacingMessage: string;
    }
>;
interface Logger {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
  groupCollapsed: (...args: any[]) => void;
  groupEnd: (...args: any[]) => void;
}
export {};
