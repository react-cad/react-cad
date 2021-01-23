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
      build: "cp src/react-cad-core.d.ts lib",
      watch: "nodemon --watch src/*.ts --exec yarn nps ts.build",
    },
    build: npsUtils.series.nps("ts.build", "wasm.build"),
    watch: npsUtils.concurrent.nps("ts.watch", "wasm.watch"),
    default: npsUtils.concurrent.nps("ts.watch", "wasm.watch"),
  },
};
