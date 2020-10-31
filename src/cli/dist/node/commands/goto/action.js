"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const config_1 = __importDefault(require("@bldr/config"));
function action() {
    // In the archive folder are no two letter folders like 'YT'.
    // We try to detect the parent folder where the presentation lies in.
    let presDir = media_manager_1.locationIndicator.getPresParentDir(process.cwd());
    let mirroredPath = media_manager_1.locationIndicator.getMirroredPath(presDir);
    // If no mirrored path could be detected we show the base path of the
    // media server.
    if (!mirroredPath)
        mirroredPath = config_1.default.mediaServer.basePath;
    console.log(`Go to: ${chalk_1.default.green(mirroredPath)}`);
    child_process_1.default.spawn('zsh', ['-i'], {
        cwd: mirroredPath,
        stdio: 'inherit'
    });
}
module.exports = action;
