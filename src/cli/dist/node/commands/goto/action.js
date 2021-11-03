"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const child_process_1 = __importDefault(require("child_process"));
const fs_1 = __importDefault(require("fs"));
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
const open_with_1 = require("@bldr/open-with");
const log = __importStar(require("@bldr/log"));
const config_ng_1 = require("@bldr/config-ng");
const config = config_ng_1.getConfig();
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
        mirroredPath = config.mediaServer.basePath;
    }
    if (!fs_1.default.existsSync(mirroredPath)) {
        log.error('The path “%s” doesn’t exist.', [mirroredPath]);
        process.exit(1);
    }
    log.info('Go to: %s', [mirroredPath]);
    if (cmdObj.fileManager) {
        open_with_1.openInFileManager(mirroredPath, true);
    }
    else {
        openShell(mirroredPath);
    }
}
module.exports = action;
