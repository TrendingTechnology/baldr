import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'api [port]',
  alias: 'a',
  description: 'Launch the REST API server. Specifiy a port to listen to if you what a different one than the default one.'
}
