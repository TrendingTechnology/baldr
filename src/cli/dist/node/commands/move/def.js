"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'move [files...]',
    alias: 'mv',
    options: [
        ['-c, --copy', 'Copy instead of move.'],
        ['-d, --dry-run', 'Do nothing, only show messages.'],
        ['-e, --extension <extension>', 'Move only files with the specified extension.'],
        ['-r, --regexp <regexp>', 'Move only files that match the specified regular expression.']
    ],
    description: 'Move / copy files from the archive folder to the main media directory. Place files which already in the main media folder into the right place (the right subfolder for example)'
});
