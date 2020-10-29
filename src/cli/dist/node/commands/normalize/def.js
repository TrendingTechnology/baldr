"use strict";
module.exports = {
    command: 'normalize [files...]',
    options: [
        ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
    ],
    alias: 'n',
    description: 'Normalize the meta data files in the YAML format (sort, clean up).'
};
