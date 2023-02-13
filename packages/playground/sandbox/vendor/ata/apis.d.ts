import { ATABootstrapConfig } from ".";
export declare const getNPMVersionsForModule: (
  config: ATABootstrapConfig,
  moduleName: string
) => Promise<
  | Error
  | {
      tags: Record<string, string>;
      versions: string[];
    }
>;
export declare const getNPMVersionForModuleReference: (
  config: ATABootstrapConfig,
  moduleName: string,
  reference: string
) => Promise<
  | Error
  | {
      version: string | null;
    }
>;
export declare type NPMTreeMeta = {
  default: string;
  files: Array<{
    name: string;
  }>;
  moduleName: string;
  version: string;
};
export declare const getFiletreeForModuleWithVersion: (
  config: ATABootstrapConfig,
  moduleName: string,
  version: string
) => Promise<
  | Error
  | {
      moduleName: string;
      version: string;
      default: string;
      files: Array<{
        name: string;
      }>;
    }
>;
export declare const getDTSFileForModuleWithVersion: (
  config: ATABootstrapConfig,
  moduleName: string,
  version: string,
  file: string
) => Promise<string | Error>;
