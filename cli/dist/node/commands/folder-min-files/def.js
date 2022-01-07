"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'folder-min-files [filePath]',
    options: [
        ['-m, --min <count>', 'Min files']
    ],
    description: 'List files of folders containing more than 20 files.'
});
