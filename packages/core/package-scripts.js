// eslint-disable-next-line @typescript-eslint/no-var-requires
const npsUtils = require("nps-utils");

module.exports = {
  scripts: {
    wasm: {
      build:
        "docker-compose run --rm react_cad_core -b /react-cad-build -s /react-cad/src -d react-cad -f ci",
      watch: "docker-compose up",
    },
    ts: {
      build: npsUtils.series.nps("ts.copy", "ts.compile"),
      watch: npsUtils.series.nps("ts.copy", "ts.compileWatch"),
      copy: "cp src/react-cad-core.d.ts lib",
      compile: "tsc",
      compileWatch: "tsc --watch",
    },
    build: npsUtils.series.nps("ts.build", "wasm.build"),
    watch: npsUtils.concurrent.nps("ts.watch", "wasm.watch"),
    default: npsUtils.concurrent.nps("ts.watch", "wasm.watch"),
  },
};
