"use strict";
const main_js_1 = require("../../main.js");
module.exports = main_js_1.validateDefintion({
    command: 'normalize [files...]',
    options: [
        ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
    ],
    alias: 'n',
    description: 'Normalize the metadata files in the YAML format (sort, clean up).'
});
