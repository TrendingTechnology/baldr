"use strict";
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * Convert multiple files.
 *
 * @param filePaths - An array of input files to convert.
 * @param cmdObj - The command object from the commander.
 */
function action(filePaths, cmdObj) {
    media_manager_1.walk({
        all: media_manager_1.operations.convertAsset
    }, {
        path: filePaths,
        payload: cmdObj
    });
}
module.exports = action;
