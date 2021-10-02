"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'build-sync',
    alias: 'bs',
    description: 'Copy the remote Vue builds into the local web server locations (sudo /usr/local/bin/baldr bs).',
    checkExecutable: ['rsync', 'chown']
});
