"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'mirror-folder-structure',
    alias: 'mfs',
    description: [
        'Mirror the folder structure of the media folder into the archive folder or vice versa.',
        'Only folders with two prefixed numbers followed by an underscore (for example “10_”) are mirrored.'
    ].join(' ')
});
