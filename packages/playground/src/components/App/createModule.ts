import React from "react";

function replaceImports(code: string) {
  return code
    .replaceAll(
      /import (.*?) from "(.+?)"/g,
      (_match: string, importName: string, packageName: string) =>
        `import ${importName} from "https://cdn.skypack.dev/${packageName}?min"`
    )
    .replaceAll(
      /import "(.*?)"/g,
      (_match: string, packageName: string) =>
        `import "https://cdn.skypack.dev/${packageName}?min"`
    );
}

function encode(code: string) {
  return code.replaceAll("\r\n", "%0A").replaceAll("\n", "%0A");
}

interface ModuleType {
  default: React.ComponentType;
}

export default async function createModule(code: string): Promise<ModuleType> {
  const mod = await import(
    /* webpackIgnore: true */ `data:text/javascript,${encode(
      replaceImports(code)
    )}`
  );

  return mod;
}
