#! /usr/bin/env node

const fs = require('fs-extra')
const os = require('os')
const path = require('path')
const process = require('process')
const util = require('util')

var commander = require('commander')
const packager = require('electron-packager')

let currentUser = os.userInfo()

if (currentUser.username !== 'root') {
  throw new Error('You must be root!')
}

function log () {
  console.log(util.format(...arguments))
}

/**
 * Package an electron app.
 *
 * @param {string} packageName - The name of the node module on npmjs.com to
 *   build an electron app from.
 * @param {string} destName - The name of the installed electron package on the
 *   destination path.
 */
class PackageElectronApp {
  constructor (packageName, destName) {
    /**
     * The name of the node module on npmjs.com to build an electron app from,
     * for example `@bldr/songbook-electron-app`
     *
     * @type {string}
     */
    this.packageName = packageName

    /**
     * The name of the installed electron package on the destination path.
     *
     * @type {string}
     */
    this.destName = destName

    /**
     * Absolute path to the node package to build an electron app with.
     *
     * @type {string}
     */
    this.packagePath = path.dirname(require.resolve(this.packageName))

    /**
     * The `package.json` of the node package to build an electron app with
     * as an object.
     *
     * @type {object}
     */
    this.packageJson = require(path.join(this.packagePath, 'package.json'))

    /**
     * The platform, for example `linux` or `darwin`.
     *
     * @type {string}
     */
    this.platform = os.platform()

    /**
     * @type {string}
     */
    this.destPrefix = ''
    if (this.platform === 'darwin') {
      this.destPrefix = path.join('/', 'Applications')
    } else {
      this.destPrefix = path.join('/', 'opt', 'electron')
    }

    /**
     * @type {string}
     */
    this.out = ''
    if (this.platform === 'darwin') {
      this.out = fs.mkdtempSync(path.join(os.tmpdir(), 'electron-'))
    } else if (this.platform === 'linux') {
      // /opt/electron/songbook
      this.out = path.join(this.destPrefix, this.destName)
      fs.mkdirSync(this.out, { 'recursive': true })
    }

    /**
     * The name of the executable inside the electron app, for example
     * `@bldr-songbook-electron-app`.
     *
     * @type {string}
     */
    this.executableName = this.packageJson.name.replace('/', '-')

    /**
     * `@bldr-songbook-electron-app-linux-x64`
     *
     * @type {string}
     */
    this.folderName = util.format('%s-%s-%s', this.executableName, this.platform, process.arch)

    /**
     * The absolute path of the electron app entry point, for example
     * `/opt/electron/songbook/@bldr-songbook-electron-app-linux-x64/@bldr-songbook-electron-app`
     *
     * @type {string}
     */
    this.executablePath = path.join(
      this.destPrefix,
      this.destName,
      this.folderName,
      this.executableName
    )

    /**
     * The path of the icons folder on linux
     * (`/usr/share/icons/baldr-electron-apps`).
     *
     * @type {string}
     */
    this.iconPath = path.join('/', 'usr', 'share', 'icons', 'baldr-electron-apps')
  }

  /**
   * Install a icon into the icons folder on linux.
   */
  installIconOnLinux () {
    let iconSrc = path.join(this.packagePath, 'icon.iconset', 'icon_256x256.png')
    let iconDest = path.join(this.iconPath, this.destName + '.png')
    fs.mkdirSync(this.iconPath, { 'recursive': true })
    fs.copyFileSync(iconSrc, iconDest)
    log('Copy icon from %s to %s', iconSrc, iconDest)
  }

  /**
   * Install the `*.desktop` file in the application folder.
   */
  installDesktopFileOnLinux () {
    let desktopContent = `[Desktop Entry]
Name=${this.destName}
Exec=${this.executablePath}
Icon=${this.iconPath}/${this.destName}.png
Terminal=false
Type=Application`
    let desktopPrefix = path.join('/', 'usr', 'share', 'applications')
    let desktopPath = path.join(desktopPrefix, this.destName + '.desktop')
    fs.removeSync(desktopPath)
    fs.appendFileSync(desktopPath, desktopContent)
    log('Create *.desktop file at the location: %s', desktopPath)
    log('The content of the start script is: %s', desktopContent)
  }

  /**
   * Install a start script into /usr/local/bin
   */
  installStarterScript () {
    let scriptContent = `#! /bin/sh

${this.executablePath} > /dev/null 2>&1 &
`
    let scriptPath = path.join(
      path.sep, 'usr', 'local', 'bin', this.destName + '_open-electron-app'
    )
    fs.removeSync(scriptPath)
    fs.appendFileSync(scriptPath, scriptContent)
    fs.chmodSync(scriptPath, '755')
    log('Create starter script at the location: %s', scriptPath)
    log('The content of the start script is: %s', scriptContent)
  }

  /**
   * Move a packaged electron folder (from the /tmp folder) into the
   * applications `/Applications` folder
   *
   * @param {array} paths - An array of paths where the electron was packaged
   *   into.
   */
  moveElectronAppIntoApplicationsOnMacOs (paths) {
    let tmpAppPath = path.join(paths[0], this.executableName + '.app')
    let destAppPath = path.join(this.destPrefix, this.destName + '.app')
    fs.moveSync(tmpAppPath, destAppPath)
    log('move %s %s', tmpAppPath, destAppPath)
  }

  /**
   * You have to run this method to package the electron app.
   */
  async packageElectronApp () {
    log('Package node package “%s” into a electron app.', this.packageName)

    if (fs.existsSync(this.out)) {
      fs.removeSync(this.out)
      log('Clean up directory: %s', this.out)
    }

    this.installStarterScript()

    if (this.platform === 'linux') {
      this.installIconOnLinux()
      this.installDesktopFileOnLinux()
    }

    log('Destination folder “%s”', this.out)
    let packageConfig = {
      // name: destName,
      // executableName: 'entry-point',
      dir: this.packagePath,
      out: this.out,
      prune: false,
      // derefSymlinks: lerna symlinks the same dependencies.
      // This symlinks are broken without the option derefSymlinks in the folder
      // packages/electron-app/dist/@bldr-songbook-electron-app-linux-x64/resources/app/node_modules/@bldr
      derefSymlinks: true,
      overwrite: true,
      arch: process.arch,
      icon: path.join(this.packagePath, 'icon.icns'),
      appVersion: this.packageJson.version,
      asar: false // Maybe asar true is very slow.
    }
    log(packageConfig)
    if (this.platform === 'darwin') {
      return packager(packageConfig).then(this.moveElectronAppIntoApplicationsOnMacOs)
    } else {
      return packager(packageConfig)
    }
  }
}

commander
  .version(require('./package.json').version)
  .option('-b, --baldr', 'Install “baldr” (@bldr/electron-app)')
  .option('-c, --camera', 'Install “camera” (@bldr/camera-electron-app)')
  .option('-s, --songbook', 'Install “songbook” (@bldr/songbook-electron-app)')
  .parse(process.argv)

if (commander.baldr) {
  new PackageElectronApp('@bldr/electron-app', 'baldr').packageElectronApp()
}

if (commander.camera) {
  new PackageElectronApp('@bldr/camera-electron-app', 'camera').packageElectronApp()
}

if (commander.songbook) {
  new PackageElectronApp('@bldr/songbook-electron-app', 'songbook').packageElectronApp()
}

if (!process.argv.slice(2).length) {
  commander.outputHelp()
}
