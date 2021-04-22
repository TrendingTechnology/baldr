"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'titles-to-tex [files...]',
    alias: 't',
    description: 'Replace the title section of the TeX files with metadata retrieved from the title.txt files.'
});
