/* eslint-disable @typescript-eslint/no-var-requires */
const build = require("@storybook/core/standalone");
const frameworkOptions = require("./lib/server/options").default;

async function buildStandalone(options) {
  return build(options, frameworkOptions);
}

module.exports = buildStandalone;
