"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'api [port]',
    alias: 'a',
    description: 'Launch the REST API server. Specifiy a port to listen to if you what a different one than the default one.'
});
