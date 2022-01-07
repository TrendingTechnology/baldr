import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'metadata-remove <media-file>',
  alias: 'mr',
  description: 'Remove metadata from a media file using ffmpeg',
  checkExecutable: ['ffmpeg']
})
