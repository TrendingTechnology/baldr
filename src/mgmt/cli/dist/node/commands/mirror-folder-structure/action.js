"use strict";
// Project packages.
const media_server_1 = require("@bldr/media-server");
function action() {
    console.log(media_server_1.mirrorFolderStructure(process.cwd()));
}
module.exports = action;
