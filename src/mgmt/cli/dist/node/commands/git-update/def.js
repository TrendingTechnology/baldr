"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'git-update',
    alias: 'gu',
    description: 'Run git pull on the media folder.',
    checkExecutable: [
        'git'
    ]
});
