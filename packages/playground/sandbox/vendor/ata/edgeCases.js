define(["require", "exports"], function (require, exports) {
  "use strict";
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.mapModuleNameToModule = void 0;
  /** Converts some of the known global imports to node so that we grab the right info */
  const mapModuleNameToModule = (name) => {
    // in node repl:
    // > require("module").builtinModules
    const builtInNodeMods = [
      "assert",
      "assert/strict",
      "async_hooks",
      "buffer",
      "child_process",
      "cluster",
      "console",
      "constants",
      "crypto",
      "dgram",
      "diagnostics_channel",
      "dns",
      "dns/promises",
      "domain",
      "events",
      "fs",
      "fs/promises",
      "http",
      "http2",
      "https",
      "inspector",
      "module",
      "net",
      "os",
      "path",
      "path/posix",
      "path/win32",
      "perf_hooks",
      "process",
      "punycode",
      "querystring",
      "readline",
      "repl",
      "stream",
      "stream/promises",
      "stream/consumers",
      "stream/web",
      "string_decoder",
      "sys",
      "timers",
      "timers/promises",
      "tls",
      "trace_events",
      "tty",
      "url",
      "util",
      "util/types",
      "v8",
      "vm",
      "wasi",
      "worker_threads",
      "zlib",
    ];
    if (builtInNodeMods.includes(name.replace("node:", ""))) {
      return "node";
    }
    return name;
  };
  exports.mapModuleNameToModule = mapModuleNameToModule;
});
