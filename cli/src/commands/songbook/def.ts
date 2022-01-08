import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'songbook',
  alias: 's',
  options: [
    ['-a, --group-alphabetically', 'List the songs in an alphabetical tree.'],
    ['-b, --base-path <base-path>', 'Base path of a song collection.'],
    ['-c, --clean', 'Clean up (delete all generated files],'],
    ['-F, --folder <folder>', 'Process only the given song folder'],
    ['-f, --force', 'Rebuild all images'],
    [
      '-i, --song-id <song-id>',
      'Process only the song with the given song ID (The parent song folder],.'
    ],
    ['-j, --json', 'Generate songs.json'],
    [
      '-l, --list <song-id-list>',
      'Use a list of song IDs in a text file to specify which songs should be updated.'
    ],
    ['-p, --piano', 'Generate the piano files only.'],
    ['-s, --slides', 'Generate the slides only.'],
    [
      '-t, --page-turn-optimized',
      'Generate a page turn friendly piano score version.'
    ]
  ],
  description: 'Update the songbook library.',
  checkExecutable: [
    'mscore-to-vector.sh',
    'pdf2svg',
    'pdfcrop',
    'pdfinfo',
    'pdftops',
    'mscore'
  ]
})
