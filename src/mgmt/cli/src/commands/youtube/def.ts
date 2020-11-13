import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'youtube <youtube-id>',
  alias: 'yt',
  description: 'Download a YouTube-Video',
  checkExecutable: [
    'youtube-dl'
  ]
}
