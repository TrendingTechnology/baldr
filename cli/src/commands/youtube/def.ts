import { validateDefintion } from '../../main.js'

export default validateDefintion({
  command: 'youtube <youtube-id>',
  alias: 'yt',
  description: 'Download a YouTube-Video',
  checkExecutable: [
    'youtube-dl'
  ]
})
