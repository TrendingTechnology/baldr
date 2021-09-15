"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'normalize [files...]',
    options: [['-w, --wikidata', 'Call wikidata to enrich the metadata.']],
    alias: 'n',
    description: 'Combine multiple tasks to manipulate the metadata, ' +
        'presentation and tex files. Create associated metadata files ' +
        'for new media files. Normalize the existing metadata files (sort, clean up). ' +
        'A keyboard shortcut is assigned to this task.'
});
