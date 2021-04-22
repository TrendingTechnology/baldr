"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'video-preview [files...]',
    alias: 'v',
    options: [
        ['-s, --seconds <seconds>', 'Take a video frame at second X from the beginning.']
    ],
    description: 'Create video preview images.',
    checkExecutable: [
        'ffmpeg'
    ]
});
