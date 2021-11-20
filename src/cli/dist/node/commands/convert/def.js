"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'convert [files...]',
    alias: 'c',
    options: [
        ['-p, --preview-image', 'Convert into preview images (Smaller and different file name)']
    ],
    description: 'Convert media files in the appropriate format. Multiple files, globbing works *.mp3',
    checkExecutable: ['ffmpeg', 'magick']
});
