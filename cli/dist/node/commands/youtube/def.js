"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'youtube <youtube-id>',
    alias: 'yt',
    description: 'Download a YouTube-Video',
    checkExecutable: [
        'youtube-dl'
    ]
});
