import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'parse-presentation [path]',
  alias: 'pp',
  options: [
    ['--resolve', 'Resolve the media assets.'],
    [
      '--check-uris',
      'Check only the media uris and do not resolve the media assets'
    ]
  ],
  description:
    'Parse a presentation file named “Praesentation.baldr.yml” or all presentation files in the current working directory.'
})
