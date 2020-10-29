"use strict";
module.exports = {
    command: 'seating-plan <notenmanager-mdb>',
    alias: 'sp',
    description: 'Convert the MDB (Access) file to json.',
    checkExecutable: [
        'mdb-export'
    ]
};
