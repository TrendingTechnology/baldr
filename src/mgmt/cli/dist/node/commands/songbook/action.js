"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const core_node_1 = require("@bldr/core-node");
const songbook_intermediate_files_1 = require("@bldr/songbook-intermediate-files");
const config_1 = __importDefault(require("@bldr/config"));
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
        config_1.default.songbook.path = cmdObj.basePath;
    }
    // To avoid strange behavior when creating the piano score
    if (!{}.hasOwnProperty.call(cmdObj, 'groupAlphabetically')) {
        cmdObj.groupAlphabetically = false;
    }
    if (!{}.hasOwnProperty.call(cmdObj, 'pageTurnOptimized')) {
        cmdObj.pageTurnOptimized = false;
    }
    core_node_1.log('The base path of the song collection is located at:\n    %s\n', chalk_1.default.cyan(config_1.default.songbook.path));
    const library = new songbook_intermediate_files_1.IntermediateLibrary(config_1.default.songbook.path);
    core_node_1.log('Found %s songs.', library.countSongs());
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
    else {
        library.update(mode, cmdObj.force);
        if (mode === 'piano' || mode === 'all') {
            library.compilePianoScore(cmdObj.groupAlphabetically, cmdObj.pageTurnOptimized);
        }
    }
}
module.exports = action;
