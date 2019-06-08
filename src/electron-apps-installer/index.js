#! /usr/bin/env node

const fs = require('fs')
const os = require('os')
const path = require('path')
const process = require('process')
const util = require('util')
const childProcess = require('child_process')

const packager = require('electron-packager')

let currentUser = os.userInfo()

if (currentUser.username !== 'root') {
  throw new Error('You must be root!')
}

let platform = os.platform()

let destPrefix
if (platform === 'darwin') {
  destPrefix = path.join('/', 'Applications')
} else {
  destPrefix = path.join('/', 'opt', 'electron')
}

/**
 *
 * @param {string} packageName - The name of the node module on npmjs.com
 * @param {string} destName - The name of the installed electron package on the
 *   destination path.
 */
async function packageElectronApp (packageName, destName) {
  console.log(util.format('Package node package “%s” into a electron app.', packageName))

  let packagePath = path.dirname(require.resolve(packageName))
  let packageJson = require(path.join(packagePath, 'package.json'))

  let out
  if (platform === 'darwin') {
    out = fs.mkdtempSync(path.join(os.tmpdir(), 'electron-'))
  } else if (platform === 'linux') {
    // /opt/electron/songbook
    out = path.join(destPrefix, destName)
    fs.mkdirSync(out, { 'recursive': true })
  }

  // @bldr-songbook-electron-app
  let executableName = packageJson.name.replace('/', '-')

  // @bldr-songbook-electron-app-linux-x64
  let folderName = util.format('%s-%s-%s', executableName, platform, process.arch)

  if (platform === 'linux') {
    // Icons
    let iconPath = path.join('/', 'usr', 'share', 'icons', 'baldr-electron-apps')
    let iconSrc = path.join(packagePath, 'icon.iconset', 'icon_256x256.png')
    let iconDest = path.join(iconPath, destName + '.png')
    fs.mkdirSync(iconPath, { 'recursive': true })
    fs.copyFileSync(iconSrc, iconDest)
    console.log(util.format('Copy icon from %s to %s', iconSrc, iconDest))

    // *.desktop file
    let desktopFile = `[Desktop Entry]
Name=${destName}
Exec=${destPrefix}/${destName}/${folderName}/${executableName}
Icon=${iconPath}/${destName}.png
Terminal=false
Type=Application`
    let desktopPrefix = path.join('/', 'usr', 'share', 'applications')
    let desktopPath = path.join(desktopPrefix, destName + '.desktop')
    fs.appendFileSync(desktopPath, desktopFile)
    console.log(util.format('Create *.desktop file at the location: %s', desktopPath))
  }

  console.log(util.format('Destination folder “%s”', out))
  let packageConfig = {
    // name: destName,
    // executableName: 'entry-point',
    dir: packagePath,
    out: out,
    prune: false,
    // derefSymlinks: lerna symlinks the same dependencies.
    // This symlinks are broken without the option derefSymlinks in the folder
    // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
    derefSymlinks: true,
    overwrite: true,
    arch: process.arch,
    icon: path.join(packagePath, 'icon.icns'),
    appVersion: packageJson.version,
    asar: false // Maybe asar true is very slow.
  }
  console.log(packageConfig)
  if (platform === 'darwin') {
    return packager(packageConfig).then(function (paths) {
      let tmpAppPath = path.join(paths[0], executableName + '.app')
      let destAppPath = path.join(destPrefix, destName + '.app')
      console.log(util.format('mv %s %s'), tmpAppPath, destAppPath)
      let process = childProcess.spawnSync('mv', [tmpAppPath, destAppPath])
      console.log(process)
    })
  } else {
    return packager(packageConfig)
  }
}

async function packageElectronApps () {
  await packageElectronApp('@bldr/songbook-electron-app', 'songbook')
  await packageElectronApp('@bldr/camera-electron-app', 'camera')
  await packageElectronApp('@bldr/electron-app', 'baldr')
}

packageElectronApps()
