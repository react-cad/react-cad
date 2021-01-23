// TODO: types?
export function config(entry = []): unknown[] {
  return [...entry, require.resolve("./addDecorator")];
}

export function webpackFinal(config: any, _options: unknown) {
  config.module.rules.push({
    test: /react-cad-core\.wasm$/,
    type: "javascript/auto",
    loader: "file-loader",
  });
  config.node = { fs: "empty" };
  return config;
}

export function managerEntries(entry = []): unknown[] {
  return [...entry, require.resolve("./register")];
}
