import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'audio-metadata <audio-file>',
  alias: 'am',
  description: 'List the audio metadata.'
}
