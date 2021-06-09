import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'yaml [files...]',
  options: [
    ['-w, --wikidata', 'Call wikidata to enrich the metadata.']
  ],
  alias: 'y',
  description: 'Create in the current working directory info files in the ' +
    'YAML format and normalize the existing metadata files (sort, clean up).'
})
