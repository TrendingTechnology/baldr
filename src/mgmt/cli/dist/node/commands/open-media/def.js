"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'open-media',
    alias: 'o',
    checkExecutable: 'xdg-open',
    description: 'Open the base directory of the media server in the file manager.'
});
