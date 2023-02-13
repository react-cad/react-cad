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
define(["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.getDTSFileForModuleWithVersion = exports.getFiletreeForModuleWithVersion = exports.getNPMVersionForModuleReference = exports.getNPMVersionsForModule = void 0;
  //  https://github.com/jsdelivr/data.jsdelivr.com
  const getNPMVersionsForModule = (config, moduleName) => {
    const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}`;
    return api(config, url, { cache: "no-store" });
  };
  exports.getNPMVersionsForModule = getNPMVersionsForModule;
  const getNPMVersionForModuleReference = (config, moduleName, reference) => {
    const url = `https://data.jsdelivr.com/v1/package/resolve/npm/${moduleName}@${reference}`;
    return api(config, url);
  };
  exports.getNPMVersionForModuleReference = getNPMVersionForModuleReference;
  const getFiletreeForModuleWithVersion = (config, moduleName, version) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const url = `https://data.jsdelivr.com/v1/package/npm/${moduleName}@${version}/flat`;
      const res = yield api(config, url);
      if (res instanceof Error) {
        return res;
      } else {
        return Object.assign(Object.assign({}, res), { moduleName, version });
      }
    });
  exports.getFiletreeForModuleWithVersion = getFiletreeForModuleWithVersion;
  const getDTSFileForModuleWithVersion = (config, moduleName, version, file) =>
    __awaiter(void 0, void 0, void 0, function* () {
      // file comes with a prefix /
      const url = `https://cdn.jsdelivr.net/npm/${moduleName}@${version}${file}`;
      const f = config.fetcher || fetch;
      const res = yield f(url);
      if (res.ok) {
        return res.text();
      } else {
        return new Error("OK");
      }
    });
  exports.getDTSFileForModuleWithVersion = getDTSFileForModuleWithVersion;
  function api(config, url, init) {
    const f = config.fetcher || fetch;
    return f(url, init).then((res) => {
      if (res.ok) {
        return res.json().then((f) => f);
      } else {
        return new Error("OK");
      }
    });
  }
});
