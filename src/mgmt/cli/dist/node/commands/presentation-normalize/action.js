"use strict";
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
/**
 * Normalize the metadata files in the YAML format (sort, clean up).
 *
 * @param filePaths - An array of input files. This parameter comes from
 *   the commanders’ variadic parameter `[files...]`.
 */
function action(filePaths) {
    media_manager_1.walk({
        presentation(filePath) {
            media_manager_1.operations.normalizePresentationFile(filePath);
        }
    }, {
        path: filePaths
    });
}
module.exports = action;
