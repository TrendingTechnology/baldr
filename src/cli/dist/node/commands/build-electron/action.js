"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Project packages.
const cli_utils_1 = require("@bldr/cli-utils");
const config_ng_1 = require("@bldr/config-ng");
const config = config_ng_1.getConfig();
const appNames = ['lamp'];
/**
 * @param appName - The name of the name. The must be the same
 *   as the parent directory.
 */
function buildElectronApp(cmd, appName) {
    return __awaiter(this, void 0, void 0, function* () {
        const appPath = path_1.default.join(config.localRepo, 'src', 'vue', 'apps', appName);
        if (!fs_1.default.existsSync(appPath)) {
            throw new Error(`App path doesn’t exist for app “${appName}”.`);
        }
        // eslint-disable-next-line
        const packageJson = require(path_1.default.join(appPath, 'package.json'));
        cmd.log(`${appName}: Install npm dependencies.`);
        yield cmd.exec(['npx', 'lerna', 'bootstrap'], { cwd: config.localRepo });
        cmd.log(`${appName}: build the Electron app.`);
        yield cmd.exec(['npm', 'run', 'build:electron'], { cwd: appPath });
        // await cmd.exec(['npm', 'run', 'install:deb'], { cwd: appPath })
        cmd.log(`${appName}: remove old .deb package.`);
        yield cmd.exec(['apt', '-y', 'remove', `baldr-${appName}`]);
        const version = packageJson.version;
        cmd.log(`${appName}: install the .deb package.`);
        yield cmd.exec([
            'dpkg',
            '-i',
            path_1.default.join(appPath, 'dist_electron', `baldr-${appName}_${version}_amd64.deb`)
        ]);
        cmd.stopSpin();
    });
}
/**
 * @param appName - The name of the app. The app name must be the same
 *   as the parent directory.
 */
function action(appName) {
    return __awaiter(this, void 0, void 0, function* () {
        const cmd = new cli_utils_1.CommandRunner({
            verbose: true
        });
        cmd.checkRoot();
        cmd.startSpin();
        try {
            if (appName == null) {
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
