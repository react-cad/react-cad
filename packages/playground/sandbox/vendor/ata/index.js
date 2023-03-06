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
define(["require", "exports", "./apis", "./edgeCases"], function (
  require,
  exports,
  apis_1,
  edgeCases_1
) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getFileTreeForModuleWithTag = exports.getNewDependencies = exports.getReferencesForModule = exports.setupTypeAcquisition = void 0;
  /**
   * The function which starts up type acquisition,
   * returns a function which you then pass the initial
   * source code for the app with.
   *
   * This is effectively the main export, everything else is
   * basically exported for tests and should be considered
   * implementation details by consumers.
   */
  const setupTypeAcquisition = (config) => {
    const moduleMap = new Map();
    const fsMap = new Map();
    let estimatedToDownload = 0;
    let estimatedDownloaded = 0;
    return (initialSourceFile) => {
      estimatedToDownload = 0;
      estimatedDownloaded = 0;
      resolveDeps(initialSourceFile, 0).then((t) => {
        var _a, _b;
        if (estimatedDownloaded > 0) {
          (_b = (_a = config.delegate).finished) === null || _b === void 0
            ? void 0
            : _b.call(_a, fsMap);
        }
      });
    };
    function resolveDeps(initialSourceFile, depth) {
      var _a, _b, _c, _d, _e;
      return __awaiter(this, void 0, void 0, function* () {
        const depsToGet = getNewDependencies(
          config,
          moduleMap,
          initialSourceFile
        );
        // Make it so it won't get re-downloaded
        depsToGet.forEach((dep) =>
          moduleMap.set(dep.module, { state: "loading" })
        );
        // Grab the module trees which gives us a list of files to download
        const trees = yield Promise.all(
          depsToGet.map((f) =>
            (0, exports.getFileTreeForModuleWithTag)(
              config,
              f.module,
              f.version
            )
          )
        );
        const treesOnly = trees.filter((t) => !("error" in t));
        // These are the modules which we can grab directly
        const hasDTS = treesOnly.filter((t) =>
          t.files.find((f) => f.name.endsWith(".d.ts"))
        );
        const dtsFilesFromNPM = hasDTS.map((t) =>
          treeToDTSFiles(t, `/node_modules/${t.moduleName}`)
        );
        // These are ones we need to look on DT for (which may not be there, who knows)
        const mightBeOnDT = treesOnly.filter((t) => !hasDTS.includes(t));
        const dtTrees = yield Promise.all(
          // TODO: Switch from 'latest' to the version from the original tree which is user-controlled
          mightBeOnDT.map((f) =>
            (0, exports.getFileTreeForModuleWithTag)(
              config,
              `@types/${getDTName(f.moduleName)}`,
              "latest"
            )
          )
        );
        const dtTreesOnly = dtTrees.filter((t) => !("error" in t));
        const dtsFilesFromDT = dtTreesOnly.map((t) =>
          treeToDTSFiles(
            t,
            `/node_modules/@types/${getDTName(t.moduleName).replace(
              "types__",
              ""
            )}`
          )
        );
        // Collect all the npm and DT DTS requests and flatten their arrays
        const allDTSFiles = dtsFilesFromNPM
          .concat(dtsFilesFromDT)
          .reduce((p, c) => p.concat(c), []);
        estimatedToDownload += allDTSFiles.length;
        if (allDTSFiles.length && depth === 0) {
          (_b = (_a = config.delegate).started) === null || _b === void 0
            ? void 0
            : _b.call(_a);
        }
        // Grab the package.jsons for each dependency
        for (const tree of treesOnly) {
          let prefix = `/node_modules/${tree.moduleName}`;
          if (dtTreesOnly.includes(tree))
            prefix = `/node_modules/@types/${getDTName(tree.moduleName).replace(
              "types__",
              ""
            )}`;
          const path = prefix + "/package.json";
          const pkgJSON = yield (0, apis_1.getDTSFileForModuleWithVersion)(
            config,
            tree.moduleName,
            tree.version,
            "/package.json"
          );
          if (typeof pkgJSON == "string") {
            fsMap.set(path, pkgJSON);
            (_d = (_c = config.delegate).receivedFile) === null || _d === void 0
              ? void 0
              : _d.call(_c, pkgJSON, path);
          } else {
            (_e = config.logger) === null || _e === void 0
              ? void 0
              : _e.error(
                  `Could not download package.json for ${tree.moduleName}`
                );
          }
        }
        // Grab all dts files
        yield Promise.all(
          allDTSFiles.map((dts) =>
            __awaiter(this, void 0, void 0, function* () {
              var _f, _g, _h;
              const dtsCode = yield (0, apis_1.getDTSFileForModuleWithVersion)(
                config,
                dts.moduleName,
                dts.moduleVersion,
                dts.path
              );
              estimatedDownloaded++;
              if (dtsCode instanceof Error) {
                // TODO?
                (_f = config.logger) === null || _f === void 0
                  ? void 0
                  : _f.error(
                      `Had an issue getting ${dts.path} for ${dts.moduleName}`
                    );
              } else {
                fsMap.set(dts.vfsPath, dtsCode);
                (_h = (_g = config.delegate).receivedFile) === null ||
                _h === void 0
                  ? void 0
                  : _h.call(_g, dtsCode, dts.vfsPath);
                // Send a progress note every 5 downloads
                if (config.delegate.progress && estimatedDownloaded % 5 === 0) {
                  config.delegate.progress(
                    estimatedDownloaded,
                    estimatedToDownload
                  );
                }
                // Recurse through deps
                yield resolveDeps(dtsCode, depth + 1);
              }
            })
          )
        );
      });
    }
  };
  exports.setupTypeAcquisition = setupTypeAcquisition;
  function treeToDTSFiles(tree, vfsPrefix) {
    const dtsRefs = [];
    for (const file of tree.files) {
      if (file.name.endsWith(".d.ts")) {
        dtsRefs.push({
          moduleName: tree.moduleName,
          moduleVersion: tree.version,
          vfsPath: `${vfsPrefix}${file.name}`,
          path: file.name,
        });
      }
    }
    return dtsRefs;
  }
  /**
   * Pull out any potential references to other modules (including relatives) with their
   * npm versioning strat too if someone opts into a different version via an inline end of line comment
   */
  const getReferencesForModule = (ts, code) => {
    const meta = ts.preProcessFile(code);
    // Ensure we don't try download TypeScript lib references
    // @ts-ignore - private but likely to never change
    const libMap = ts.libMap || new Map();
    // TODO: strip /// <reference path='X' />?
    const references = meta.referencedFiles
      .concat(meta.importedFiles)
      .concat(meta.libReferenceDirectives)
      .filter((f) => !f.fileName.endsWith(".d.ts"))
      .filter((d) => !libMap.has(d.fileName));
    return references.map((r) => {
      let version = undefined;
      if (!r.fileName.startsWith(".")) {
        version = "latest";
        const line = code.slice(r.end).split("\n")[0];
        if (line.includes("// types:"))
          version = line.split("// types: ")[1].trim();
      }
      return {
        module: r.fileName,
        version,
      };
    });
  };
  exports.getReferencesForModule = getReferencesForModule;
  /** A list of modules from the current sourcefile which we don't have existing files for */
  function getNewDependencies(config, moduleMap, code) {
    const refs = (0, exports.getReferencesForModule)(
      config.typescript,
      code
    ).map((ref) =>
      Object.assign(Object.assign({}, ref), {
        module: (0, edgeCases_1.mapModuleNameToModule)(ref.module),
      })
    );
    // Drop relative paths because we're getting all the files
    const modules = refs
      .filter((f) => !f.module.startsWith("."))
      .filter((m) => !moduleMap.has(m.module));
    return modules;
  }
  exports.getNewDependencies = getNewDependencies;
  /** The bulk load of the work in getting the filetree based on how people think about npm names and versions */
  const getFileTreeForModuleWithTag = (config, moduleName, tag) =>
    __awaiter(void 0, void 0, void 0, function* () {
      let toDownload = tag || "latest";
      // I think having at least 2 dots is a reasonable approx for being a semver and not a tag,
      // we can skip an API request, TBH this is probably rare
      if (toDownload.split(".").length < 2) {
        // The jsdelivr API needs a _version_ not a tag. So, we need to switch out
        // the tag to the version via an API request.
        const response = yield (0, apis_1.getNPMVersionForModuleReference)(
          config,
          moduleName,
          toDownload
        );
        if (response instanceof Error) {
          return {
            error: response,
            userFacingMessage: `Could not go from a tag to version on npm for ${moduleName} - possible typo?`,
          };
        }
        const neededVersion = response.version;
        if (!neededVersion) {
          const versions = yield (0, apis_1.getNPMVersionsForModule)(
            config,
            moduleName
          );
          if (versions instanceof Error) {
            return {
              error: response,
              userFacingMessage: `Could not get versions on npm for ${moduleName} - possible typo?`,
            };
          }
          const tags = Object.entries(versions.tags).join(", ");
          return {
            error: new Error("Could not find tag for module"),
            userFacingMessage: `Could not find a tag for ${moduleName} called ${tag}. Did find ${tags}`,
          };
        }
        toDownload = neededVersion;
      }
      const res = yield (0, apis_1.getFiletreeForModuleWithVersion)(
        config,
        moduleName,
        toDownload
      );
      if (res instanceof Error) {
        return {
          error: res,
          userFacingMessage: `Could not get the files for ${moduleName}@${toDownload}. Is it possibly a typo?`,
        };
      }
      return res;
    });
  exports.getFileTreeForModuleWithTag = getFileTreeForModuleWithTag;
  // Taken from dts-gen: https://github.com/microsoft/dts-gen/blob/master/lib/names.ts
  function getDTName(s) {
    if (s.indexOf("@") === 0 && s.indexOf("/") !== -1) {
      // we have a scoped module, e.g. @bla/foo
      // which should be converted to   bla__foo
      s = s.substr(1).replace("/", "__");
    }
    return s;
  }
});
