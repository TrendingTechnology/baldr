"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'normalize [files...]',
    options: [
        ['-w, --wikidata', 'Call wikidata to enrich the metadata.'],
        [
            '--parent-pres-dir',
            'Run the normalize command on all files in the parent presentation folder.'
        ]
    ],
    alias: 'n',
    description: 'Combine multiple tasks to manipulate the metadata, ' +
        'presentation and TeX files. Create associated metadata files ' +
        'for new media files. Normalize the existing metadata files (sort, clean up). ' +
        'A keyboard shortcut is assigned to this task.'
});
