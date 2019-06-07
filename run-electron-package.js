#! /usr/bin/env node

const path = require('path')
const process = require('process')
const packager = require('electron-packager')

async function packageElectronApp(packageName) {
  let packagePath = path.dirname(require.resolve(packageName))
  let packageJson = require(path.join(packagePath, 'package.json'))
  let electronName = packageJson.name.replace('/', '-')
  //let appName = util.format('%s-%s-%s', electronName, process.platform, process.arch)
  //let distFolder = path.join(packagePath, 'dist')
  let distFolder = '/home/jf/Downloads/songbook'

  let darwinPath = []
  if (process.platform === 'darwin') {
    darwinPath = [electronName + '.app', 'Contents', 'MacOS']
  }
  //appPath = path.join(this.distFolder, this.appName, ...darwinPath, electronName)

  // derefSymlinks: lerna symlinks the some dependencies.
  // This symlinks are broken without the option derefSymlinks in the folder
  // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
  return await packager({
    dir: packagePath,
    out: distFolder,
    prune: false,
    derefSymlinks: true,
    overwrite: true,
    arch: process.arch,
    icon: path.join(packagePath, 'icon.icns'),
    appVersion: packageJson.version,
    asar: true
  })
}

packageElectronApp('@bldr/songbook-electron-app')
