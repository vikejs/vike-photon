import { type PackageJson, readPackage } from "pkg-types";

let _localPackage: PackageJson | null = null;
async function getLocalPackage() {
  if (!_localPackage) {
    _localPackage = await readPackage();
  }
  return _localPackage;
}

export async function isDependencyInstalledByUser(pkg: string) {
  const localPackage = await getLocalPackage();

  for (const prop of ["devDependencies", "dependencies"]) {
    if (localPackage[prop] && Object.keys(localPackage[prop]).includes(pkg)) {
      return true;
    }
  }
  return false;
}
