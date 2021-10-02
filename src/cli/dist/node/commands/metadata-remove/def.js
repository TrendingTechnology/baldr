"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'metadata-remove <media-file>',
    alias: 'mr',
    description: 'Remove metadata from a media file using ffmpeg',
    checkExecutable: ['ffmpeg']
});
