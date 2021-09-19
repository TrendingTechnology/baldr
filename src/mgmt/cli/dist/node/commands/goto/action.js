"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const open_with_1 = require("@bldr/open-with");
const config_1 = __importDefault(require("@bldr/config"));
function openShell(filePath) {
    child_process_1.default.spawn('zsh', ['-i'], {
        cwd: filePath,
        stdio: 'inherit'
    });
}
function action(cmdObj) {
    // In the archive folder are no two letter folders like 'YT'.
    // We try to detect the parent folder where the presentation lies in.
    const presDir = media_manager_1.locationIndicator.getPresParentDir(process.cwd());
    if (presDir == null) {
        throw new Error('You are not in a presentation folder!');
    }
    let mirroredPath = media_manager_1.locationIndicator.getMirroredPath(presDir);
    // If no mirrored path could be detected we show the base path of the
    // media server.
    if (mirroredPath == null) {
        mirroredPath = config_1.default.mediaServer.basePath;
    }
    if (!fs_1.default.existsSync(mirroredPath)) {
        console.log(`The path “${chalk_1.default.red(mirroredPath)}” doesn’t exist.`);
        process.exit(1);
    }
    console.log(`Go to: ${chalk_1.default.green(mirroredPath)}`);
    if (cmdObj.fileManager) {
        open_with_1.openInFileManager(mirroredPath, true);
    }
    else {
        openShell(mirroredPath);
    }
}
module.exports = action;
