import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'audio-cut <audio-file>',
  alias: 'ac',
  description: 'Cut a audio file at a given length and fade out',
  checkExecutable: ['ffmpeg']
})
