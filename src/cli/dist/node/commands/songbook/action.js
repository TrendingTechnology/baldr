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
// Project packages.
const log = __importStar(require("@bldr/log"));
const songbook_intermediate_files_1 = require("@bldr/songbook-intermediate-files");
const config_1 = require("@bldr/config");
const config = config_1.getConfig();
/**
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(cmdObj) {
    if (cmdObj.folder != null) {
        cmdObj.force = true;
    }
    let mode;
    if (cmdObj.slides) {
        mode = 'slides';
    }
    else if (cmdObj.piano) {
        mode = 'piano';
    }
    else {
        mode = 'all';
    }
    if (cmdObj.basePath != null && cmdObj.basePath.length > 0) {
        config.songbook.path = cmdObj.basePath;
    }
    // To avoid strange behavior when creating the piano score
    if (!{}.hasOwnProperty.call(cmdObj, 'groupAlphabetically')) {
        cmdObj.groupAlphabetically = false;
    }
    if (!{}.hasOwnProperty.call(cmdObj, 'pageTurnOptimized')) {
        cmdObj.pageTurnOptimized = false;
    }
    log.info('The base path of the song collection is located at:\n    %s\n', [
        log.colorize.cyan(config.songbook.path)
    ]);
    const library = new songbook_intermediate_files_1.IntermediateLibrary(config.songbook.path);
    log.info('Found %s songs.', [library.countSongs()]);
    if (cmdObj.list != null)
        library.loadSongList(cmdObj.list);
    if (cmdObj.clean) {
        library.cleanIntermediateFiles();
    }
    else if (cmdObj.folder != null) {
        library.updateSongByPath(cmdObj.folder, mode);
    }
    else if (cmdObj.songId != null) {
        library.updateSongBySongId(cmdObj.songId, mode);
    }
    else if (cmdObj.json != null) {
        library.generateLibraryJson();
    }
    else {
        library.update(mode, cmdObj.force);
        if (mode === 'piano' || mode === 'all') {
            library.compilePianoScore(cmdObj.groupAlphabetically, cmdObj.pageTurnOptimized);
        }
    }
}
module.exports = action;
