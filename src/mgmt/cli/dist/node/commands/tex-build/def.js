"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'tex-build [files...]',
    alias: 'tb',
    description: 'Build TeX files.',
    checkExecutable: [
        'lualatex'
    ]
});
