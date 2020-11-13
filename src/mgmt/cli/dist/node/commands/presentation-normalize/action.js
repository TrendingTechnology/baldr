"use strict";
// Project packages.
const media_manager_1 = require("@bldr/media-manager");
function action(filePath) {
    media_manager_1.operations.normalizePresentationFile(filePath);
}
module.exports = action;
