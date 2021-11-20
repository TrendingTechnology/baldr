"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'multipart <glob> <prefix>',
    alias: 'mp',
    options: [
        ['-d, --dry-run', 'Test first']
    ],
    description: 'Rename multipart assets. Example “b mp "*.jpg" Systeme”'
});
