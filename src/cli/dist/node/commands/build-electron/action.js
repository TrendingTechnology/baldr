var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node packages.
const fs = require('fs');
const path = require('path');
// Project packages:
const { CommandRunner } = require('@bldr/cli-utils');
// Globals.
const { config } = require('../../main.js');
const appNames = [
    'lamp'
];
/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
function buildElectronApp(cmd, appName) {
    return __awaiter(this, void 0, void 0, function* () {
        const appPath = path.join(config.localRepo, 'src', appName);
        if (!fs.existsSync(appPath)) {
            throw new Error(`App path doesn’t exist for app “${appName}”.`);
        }
        const packageJson = require(path.join(appPath, 'package.json'));
        cmd.log(`${appName}: Install npm dependencies.`);
        yield cmd.exec(['npx', 'lerna', 'bootstrap'], { cwd: config.localRepo });
        cmd.log(`${appName}: build the Electron app.`);
        yield cmd.exec(['npm', 'run', 'build:electron'], { cwd: appPath });
        // await cmd.exec(['npm', 'run', 'install:deb'], { cwd: appPath })
        cmd.log(`${appName}: remove old .deb package.`);
        yield cmd.exec(['apt', '-y', 'remove', `baldr-${appName}`]);
        cmd.log(`${appName}: install the .deb package.`);
        yield cmd.exec(['dpkg', '-i', path.join(appPath, 'dist_electron', `baldr-${appName}_${packageJson.version}_amd64.deb`)]);
        cmd.stopSpin();
    });
}
/**
 * @param {String} appName - The name of the app. The app name must be the same
 *   as the parent directory.
 * @param {Object} cmdObj
 * @param {Object} globalOpts
 */
function action(appName, cmdObj, globalOpts) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new CommandRunner({
            verbose: true
        });
        cmd.checkRoot();
        cmd.startSpin();
        try {
            if (!appName) {
                for (const appName of appNames) {
                    yield buildElectronApp(cmd, appName);
                }
            }
            else {
                yield buildElectronApp(cmd, appName);
            }
            cmd.stopSpin();
        }
        catch (error) {
            cmd.catch(error);
        }
    });
}
module.exports = action;
