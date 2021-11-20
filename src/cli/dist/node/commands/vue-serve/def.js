"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'vue-serve [app-name]',
    alias: 'vs',
    description: 'Serve a Vue web app.',
    checkExecutable: [
        'npm'
    ]
});
