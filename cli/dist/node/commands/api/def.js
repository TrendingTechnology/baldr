"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'api [port]',
    alias: 'a',
    options: [
        ['-r, --restart', 'Restart the REST API.']
    ],
    description: 'Launch the REST API server. Specifiy a port to listen to if you what a different one than the default one.'
});
