import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'normalize [files...]',
  options: [['-w, --wikidata', 'Call wikidata to enrich the metadata.']],
  alias: 'n',
  description:
    'Combine multiple tasks to manipulate the metadata, ' +
    'presentation and tex files. Create associated metadata files ' +
    'for new media files. Normalize the existing metadata files (sort, clean up). ' +
    'A keyboard shortcut is assigned to this task.'
})
