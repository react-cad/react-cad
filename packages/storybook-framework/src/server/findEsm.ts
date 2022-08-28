import path from "path";
import { sync as findUpSync } from "find-up";

export const findEsm = (cwd: string, relativePath: string): string => {
  const nearestPackageJson = findUpSync("package.json", { cwd });
  if (!nearestPackageJson) {
    throw new Error(`Could not find package.json in: ${cwd}`);
  }
  const packageDir = path.dirname(nearestPackageJson);

  return path.join(packageDir, "lib", relativePath);
};
