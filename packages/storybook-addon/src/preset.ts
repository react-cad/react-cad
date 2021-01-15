// TODO: types?
export function config(entry = []): unknown[] {
  return [...entry, require.resolve("./addDecorator")];
}

export function managerEntries(entry = []): unknown[] {
  return [...entry, require.resolve("./register")];
}
