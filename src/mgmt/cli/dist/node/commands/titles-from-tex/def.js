"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'titles-from-tex [files...]',
    alias: 'tf',
    options: [
        ['-f, --force', 'Overwrite existing `title.txt` files.']
    ],
    description: 'Create from the TeX files the folder titles text file `title.txt`.'
});
