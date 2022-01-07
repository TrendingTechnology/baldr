"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'npm-run <scriptName> <file>',
    description: 'Change to the parent directory of the specified file and run “npm run <scriptName>”',
    checkExecutable: 'npm'
});
