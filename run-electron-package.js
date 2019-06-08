#! /usr/bin/env node

const path = require('path')
const process = require('process')
const packager = require('electron-packager')
const os = require('os')
const fs = require('fs')

let currentUser = os.userInfo()

if (currentUser.username !== 'root') {
  throw new Error('You must be root!')
}

let platform = os.platform()

let distPrefix
if (platform === 'darwin') {
  distPrefix = path.join('/', 'Applications')
} else {
  distPrefix = path.join('/', 'opt', 'electron')
}

async function packageElectronApp (packageName, distName) {
  let packagePath = path.dirname(require.resolve(packageName))
  let packageJson = require(path.join(packagePath, 'package.json'))
  let out = path.join(distPrefix, distName)
  fs.mkdirSync(out, { 'recursive': true })

  //   let desktopFile = `[Desktop Entry]
  // Name=${distName}
  // Exec=lindvd
  // Icon=/usr/share/icons/LinDVD.xpm
  // Terminal=false
  // Type=Application
  // Categories=AudioVideo;Player;
  // MimeType=video/mpeg;audio/mpeg;`
  //   desktopFile

  // derefSymlinks: lerna symlinks the same dependencies.
  // This symlinks are broken without the option derefSymlinks in the folder
  // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
  return packager({
    dir: packagePath,
    out: path.join(distPrefix, distName),
    prune: false,
    derefSymlinks: true,
    overwrite: true,
    arch: process.arch,
    icon: path.join(packagePath, 'icon.icns'),
    appVersion: packageJson.version,
    asar: true
  })
}

// /usr/share/applications

// /usr/share/icons/
async function packageElectronApps () {
  await packageElectronApp('@bldr/songbook-electron-app', 'songbook')
  await packageElectronApp('@bldr/camera-electron-app', 'camera')
  await packageElectronApp('@bldr/electron-app', 'baldr')
}

packageElectronApps()
