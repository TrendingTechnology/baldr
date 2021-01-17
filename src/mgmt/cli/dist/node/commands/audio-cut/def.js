"use strict";
module.exports = {
    command: 'audio-cut <audio-file>',
    alias: 'ac',
    description: 'Cut a audio file at a given length and fade out',
    checkExecutable: ['ffmpeg']
};
