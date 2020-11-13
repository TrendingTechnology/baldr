"use strict";
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * Rename files.
 *
 * @param {Array} filePaths - An array of input files, comes from the
 *   commanders’ variadic parameter `[files...]`.
 */
function action(filePaths) {
    media_manager_1.walk({
        all(oldPath) {
            media_manager_1.operations.renameMediaAsset(oldPath);
        }
    }, {
        path: filePaths
    });
}
module.exports = action;
