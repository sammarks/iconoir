import { execSync } from 'child_process';
import semver from 'semver';
import path from 'path';
import fs from 'fs';

const BASE_VERSION = '2.1.0';
const PACKAGE_BASE = '@sammarks';

function publishPackage(name) {
  console.info('Publishing %s', name);

  const currentVersion =
    execSync(`npm view ${name} version`).toString() || BASE_VERSION;
  console.info('Current version is %s', currentVersion);

  const newVersion = semver.inc(currentVersion, 'minor');
  console.info('New version is %s', newVersion);

  const packageJsonPath = path.join('packages', name, 'package.json');
  const contents = JSON.parse(fs.readFileSync(packageJsonPath).toString());
  contents.version = newVersion;
  if (PACKAGE_BASE) {
    contents.name = `${PACKAGE_BASE}/${name}`;
  }
  fs.writeFileSync(packageJsonPath, JSON.stringify(contents, undefined, 2));
  console.info('package.json updated');

  console.info('Building...');
  execSync('npm run dist', {
    cwd: path.join(process.cwd(), 'packages', name),
  });

  console.info('Publishing %s...', newVersion);
  execSync('npm run publish', {
    cwd: path.join(process.cwd(), 'packages', name),
    env: {
      NODE_AUTH_TOKEN: process.env.NODE_AUTH_TOKEN,
    },
  });

  console.info('Complete!');
}

publishPackage('iconoir-react');
publishPackage('iconoir-react-native');
