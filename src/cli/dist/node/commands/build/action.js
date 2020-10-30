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
const config = require('@bldr/config');
const appNames = [
    'lamp',
    'seating-plan',
    'showroom',
    'songbook'
];
/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
function buildApp(cmd, appName) {
    return __awaiter(this, void 0, void 0, function* () {
        const appPath = path.join(config.localRepo, 'src', appName);
        if (!fs.existsSync(appPath)) {
            throw new Error(`App path doesn’t exist for app “${appName}”.`);
        }
        cmd.log(`${appName}: build the Vue app.`);
        yield cmd.exec(['npm', 'run', 'build:webapp'], { cwd: appPath });
        let destinationDir;
        if (appName === 'lamp') {
            destinationDir = 'presentation';
        }
        else {
            destinationDir = appName;
        }
        cmd.log(`${appName}: push the build to the remote HTTP server.`);
        yield cmd.exec([
            'rsync',
            '-av',
            '--delete',
            '--usermap', `jf:${config.http.webServerUser}`,
            '--groupmap', `jf:${config.http.webServerGroup}`,
            `${appPath}/dist/`,
            `${config.mediaServer.sshAliasRemote}:${config.http.webRoot}/${destinationDir}/`
        ]);
        cmd.stopSpin();
    });
}
/**
 * @param {String} appName - The name of the name. The must be the same
 *   as the parent directory.
 */
function action(appName) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new CommandRunner();
        cmd.startSpin();
        try {
            if (!appName) {
                for (let appName of appNames) {
                    yield buildApp(cmd, appName);
                }
            }
            else {
                yield buildApp(cmd, appName);
            }
            cmd.stopSpin();
        }
        catch (error) {
            cmd.catch(error);
        }
    });
}
module.exports = action;
