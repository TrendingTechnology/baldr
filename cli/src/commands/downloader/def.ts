import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'download <url> [id] [extension]',
  alias: 'dl',
  description: 'Download a media asset to the current working directory.'
})
