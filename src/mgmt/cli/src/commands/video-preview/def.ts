import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'video-preview [files...]',
  alias: 'v',
  options: [
    ['-s, --seconds <seconds>', 'Take a video frame at second X from the beginning.']
  ],
  description: 'Create video preview images.',
  checkExecutable: [
    'ffmpeg'
  ]
})
