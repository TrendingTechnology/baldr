import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'youtube <youtube-id>',
  alias: 'yt',
  description: 'Download a YouTube-Video',
  checkExecutable: [
    'youtube-dl'
  ]
})
