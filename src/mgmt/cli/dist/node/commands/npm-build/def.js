"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'npm-build <file>',
    description: 'Change to the parent directory of the specified file and run “npm run build”',
    checkExecutable: 'npm'
});
