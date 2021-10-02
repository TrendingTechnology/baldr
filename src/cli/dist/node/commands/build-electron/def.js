"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'build-electron [app-name]',
    alias: 'be',
    description: 'Build the Electron apps.',
    checkExecutable: ['npm']
});
