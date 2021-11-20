"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'cloze [input]',
    alias: 'cl',
    checkExecutable: ['pdfinfo', 'pdf2svg', 'lualatex'],
    description: 'Generate from TeX files with cloze texts SVGs for baldr.'
});
