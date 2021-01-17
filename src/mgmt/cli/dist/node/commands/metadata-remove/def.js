"use strict";
module.exports = {
    command: 'metadata-remove <media-file>',
    alias: 'mr',
    description: 'Remove metadata from a media file using ffmpeg',
    checkExecutable: ['ffmpeg']
};
