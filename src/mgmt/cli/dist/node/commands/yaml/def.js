"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'yaml [files...]',
    options: [
        ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
    ],
    alias: 'y',
    description: 'Create in the current working directory info files in the ' +
        'YAML format and normalize the existing metadata files (sort, clean up).'
});
