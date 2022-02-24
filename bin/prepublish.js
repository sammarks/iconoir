import { execSync } from 'child_process';
import semver from 'semver';
import path from 'path';
import fs from 'fs';

const BASE_VERSION = '3.0.0';
const PACKAGE_BASE = '@sammarks';

function publishPackage(name) {
  console.info('Publishing %s', name);

  const fullPackageName = [PACKAGE_BASE, name].filter(Boolean).join('/');
  const currentVersion =
    execSync(`npm view ${fullPackageName} version`).toString() || BASE_VERSION;

  console.info('Current version is %s', currentVersion);

  let newVersion = semver.inc(currentVersion, 'minor');
  // If we have not yet met the base version, reset it.
  if (semver.gt(BASE_VERSION, newVersion)) {
    newVersion = BASE_VERSION;
  }
  console.info('New version is %s', newVersion);

  const packageJsonPath = path.join('packages', name, 'package.json');
  const contents = JSON.parse(fs.readFileSync(packageJsonPath).toString());
  contents.version = newVersion;
  if (PACKAGE_BASE) {
    contents.name = `${PACKAGE_BASE}/${name}`;
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(contents, undefined, 2));
  console.info('package.json updated');
}

publishPackage('iconoir-react');
publishPackage('iconoir-react-native');
