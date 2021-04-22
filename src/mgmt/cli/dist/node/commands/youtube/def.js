"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'youtube <youtube-id>',
    alias: 'yt',
    description: 'Download a YouTube-Video',
    checkExecutable: [
        'youtube-dl'
    ]
});
