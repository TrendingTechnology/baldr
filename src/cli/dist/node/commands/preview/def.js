"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'preview [files...]',
    alias: 'pv',
    options: [
        ['-s, --seconds <seconds>', 'Take a video frame at second X from the beginning.'],
        ['-f, --force', 'Overwrite already existing preview files']
    ],
    description: 'Create preview images for PDFs, videos and audio (cover download) files.',
    checkExecutable: [
        'ffmpeg', 'pdftocairo'
    ]
});
