"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'docs [action]',
    alias: 'd',
    description: '[generate|open]: Generate / open the project documentation',
    checkExecutable: ['xdg-open']
});
