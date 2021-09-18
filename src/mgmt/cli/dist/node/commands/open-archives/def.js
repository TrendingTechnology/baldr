"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'open-archives [path]',
    alias: 'oa',
    options: [
        [
            '-c, --create-dirs',
            'Create missings directories.'
        ]
    ],
    checkExecutable: 'xdg-open',
    description: 'Open the parent presentation archive folders of the given file path.'
});
