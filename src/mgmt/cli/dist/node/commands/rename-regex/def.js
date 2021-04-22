"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'rename-regex <pattern> <replacement> [path]',
    alias: 'rr',
    description: 'Rename files by regex. see String.prototype.replace()'
});
