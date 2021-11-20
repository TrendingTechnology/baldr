"use strict";
const main_js_1 = require("../../main.js");
module.exports = (0, main_js_1.validateDefintion)({
    command: 'seating-plan <notenmanager-mdb>',
    alias: 'sp',
    description: 'Convert the MDB (Access) file to json.',
    checkExecutable: [
        'mdb-export'
    ]
});
