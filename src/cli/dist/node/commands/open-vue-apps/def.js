"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'open-vue-app [name]',
    alias: 'ova',
    checkExecutable: 'chromium-browser',
    description: 'Open a Vue app in Chromium.'
});
