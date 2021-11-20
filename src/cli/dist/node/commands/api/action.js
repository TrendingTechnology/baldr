"use strict";
const media_server_1 = require("@bldr/media-server");
function action(port) {
    (0, media_server_1.runRestApi)(port);
}
module.exports = action;
