"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
// Node packages.
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Third party packages.
const chalk_1 = __importDefault(require("chalk"));
// Project packages.
const core_node_1 = require("@bldr/core-node");
const songbook_intermediate_files_1 = __importDefault(require("@bldr/songbook-intermediate-files"));
const config_1 = __importDefault(require("@bldr/config"));
/**
 * @param cmdObj - An object containing options as key-value pairs.
 *  This parameter comes from `commander.Command.opts()`
 */
function action(cmdObj) {
    if (cmdObj.folder) {
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
    if (cmdObj.basePath && cmdObj.basePath.length > 0) {
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
    if (cmdObj.projectorPath)
        config_1.default.songbook.projectorPath = cmdObj.projectorPath;
    if (config_1.default.songbook.projectorPath === 'none')
        config_1.default.songbook.projectorPath = '';
    if (config_1.default.songbook.projectorPath) {
        core_node_1.log('The folder where all projector related files are stored is:\n    %s\n', chalk_1.default.green(config_1.default.songbook.projectorPath));
    }
    // Maybe bug in commander ?
    if (cmdObj.piapath)
        cmdObj.pianoPath = cmdObj.piapath;
    if (cmdObj.pianoPath)
        config_1.default.songbook.pianoPath = cmdObj.pianoPath;
    if (config_1.default.songbook.pianoPath === 'none')
        config_1.default.songbook.pianoPath = '';
    if (config_1.default.songbook.pianoPath) {
        core_node_1.log('The folder where all piano related files are stored is:\n    %s\n', chalk_1.default.green(config_1.default.songbook.pianoPath));
    }
    const library = new songbook_intermediate_files_1.default.IntermediateLibrary(config_1.default.songbook.path, config_1.default.songbook.projectorPath, config_1.default.songbook.pianoPath);
    core_node_1.log('Found %s songs.', library.countSongs());
    if (cmdObj.list)
        library.loadSongList(cmdObj.list);
    if (cmdObj.clean) {
        library.cleanIntermediateFiles();
    }
    else if (cmdObj.folder) {
        library.updateSongByPath(cmdObj.folder, mode);
    }
    else if (cmdObj.songId) {
        library.updateSongBySongId(cmdObj.songId, mode);
    }
    else {
        library.update(mode, cmdObj.force);
        songbook_intermediate_files_1.default.exportToMediaServer(library);
        if (mode === 'piano' || mode === 'all') {
            const pianoScore = new songbook_intermediate_files_1.default.PianoScore(library, cmdObj.groupAlphabetically, cmdObj.pageTurnOptimized);
            pianoScore.compile();
        }
        if (config_1.default.songbook.projectorPath) {
            const projectorPath = path_1.default.join(config_1.default.songbook.projectorPath, 'songs.json');
            fs_1.default.writeFileSync(projectorPath, JSON.stringify(library, null, '  '));
            core_node_1.log('Create JSON file: %s', chalk_1.default.yellow(projectorPath));
        }
        songbook_intermediate_files_1.default.buildVueApp();
    }
}
module.exports = action;
