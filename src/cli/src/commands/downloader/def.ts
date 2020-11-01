import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'download <url> [id] [extension]',
  alias: 'dl',
  description: 'Download a media asset to the current working directory.'
}
