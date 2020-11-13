import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'video-preview [files...]',
  alias: 'v',
  options: [
    ['-s, --seconds <seconds>', 'Take a video frame at second X from the beginning.']
  ],
  description: 'Create video preview images.',
  checkExecutable: [
    'ffmpeg'
  ]
}
