import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'wikidata <metadata-type> <item-id> [arg1] [arg2]',
  alias: 'w',
  options: [
    ['-d, --dry-run', 'Create not YAML files. Download no images.']
  ],
  description: [
    'Query wikidata.org.',
    'Metadata types: group, instrument, person, song',
    'Examples:',
    'group (The Beatles): baldr wikidata group Q1299',
    'instrument (Englischhorn): baldr wikidata instrument Q185041',
    'person (Ludwig van Beethoven): baldr wikidata person Q255',
    'song (Jamaica Farewell): baldr wikidata song Q6127294',
    'song (Yesterday): baldr wikidata song Q202698'
  ].join(' ')
})
