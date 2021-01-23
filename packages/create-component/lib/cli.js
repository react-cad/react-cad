#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const cwd = process.cwd();
const packageName = process.argv[2];

if (!packageName) {
  console.error("No package name provided. Invoke with `create-element packageName`");
  process.exit(1);
}

function copyDir(fromPath, toPath) {
  const filesToCreate = fs.readdirSync(fromPath);

  filesToCreate.forEach(file => {
    const origFilePath = path.join(fromPath, file);
    const stats = fs.statSync(origFilePath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(origFilePath, 'utf8');
      const writePath = path.join(toPath, file);
      const output = contents.replace("%PACKAGE_NAME%", packageName);
      fs.writeFileSync(writePath, output, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(path.join(toPath, file));
      copyDir(path.join(fromPath, file), path.join(toPath, file));
    }
  });
}


const templatePath = path.join(__dirname, 'template');
const packagePath = path.join(cwd, packageName);

console.log(`Creating @react-cad component in ${packagePath}`);

fs.mkdirSync(packagePath)
copyDir(templatePath, packagePath);
