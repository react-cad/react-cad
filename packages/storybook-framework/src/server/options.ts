import { sync } from "read-pkg-up";
import type { LoadOptions } from "@storybook/core-common";

export default {
  packageJson: sync({ cwd: __dirname })?.packageJson,
  framework: "react-cad",
  frameworkPath: "@react-cad/storybook-framework",
  frameworkPresets: [require.resolve("./preset")],
  extendServer: (server) => {
    server.prependListener("request", (_req, res) => {
      if (!res.headersSent) {
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      }
    });
  },
} as LoadOptions;
