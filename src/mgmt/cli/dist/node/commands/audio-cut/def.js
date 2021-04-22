"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'audio-cut <audio-file>',
    alias: 'ac',
    description: 'Cut a audio file at a given length and fade out',
    checkExecutable: ['ffmpeg']
});
