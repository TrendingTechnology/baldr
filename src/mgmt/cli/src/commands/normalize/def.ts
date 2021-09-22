import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'normalize [files...]',
  options: [
    ['-w, --wikidata', 'Call wikidata to enrich the metadata.'],
    [
      '--parent-pres-dir',
      'Run the normalize command on all files in the parent presentation folder.'
    ]
  ],
  alias: 'n',
  description:
    'Combine multiple tasks to manipulate the metadata, ' +
    'presentation and tex files. Create associated metadata files ' +
    'for new media files. Normalize the existing metadata files (sort, clean up). ' +
    'A keyboard shortcut is assigned to this task.'
})
