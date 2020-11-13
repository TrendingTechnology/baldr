import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'cover-downloader [files...]',
  alias: 'cd',
  description: 'Download the cover _preview.jpg. The meta data info file must have a key named cover_source.'
}
