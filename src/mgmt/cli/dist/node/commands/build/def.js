"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'build [app-name]',
    alias: 'b',
    description: 'Build the Vue apps',
    checkExecutable: ['npm', 'rsync']
});
