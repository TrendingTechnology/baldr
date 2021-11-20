"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'presentation-template [path]',
    alias: 'p',
    options: [['-f, --force', 'Overwrite an existing presentation file.']],
    description: 'Create a presentation template from the assets of the current working directory named “Praesentation.baldr.yml”.'
});
