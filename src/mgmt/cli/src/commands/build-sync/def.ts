import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'build-sync',
  alias: 'bs',
  description: 'Copy the remote Vue builds into the local web server locations (sudo /usr/local/bin/baldr bs).',
  checkExecutable: ['rsync', 'chown']
}
