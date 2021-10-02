import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'preview [files...]',
  alias: 'pv',
  options: [
    ['-s, --seconds <seconds>', 'Take a video frame at second X from the beginning.'],
    ['-f, --force', 'Overwrite already existing preview files']
  ],
  description: 'Create preview images for PDFs, videos and audio (cover download) files.',
  checkExecutable: [
    'ffmpeg', 'pdftocairo'
  ]
})
