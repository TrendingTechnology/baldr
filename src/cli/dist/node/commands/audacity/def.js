"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'audacity <text-mark-file>',
    alias: 'au',
    description: [
        'Convert a Audacity text mark file into a YAML file.',
        'Use the keyboard shortcuts ctrl+b or ctrl+m to create text marks in the software Audacity.',
        'Go to the text mark manager (Edit > text marks) to export the marks.'
    ].join(' ')
});
