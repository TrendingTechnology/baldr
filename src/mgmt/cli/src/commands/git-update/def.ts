import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'git-update',
  alias: 'gu',
  description: 'Run git pull on the media folder.',
  checkExecutable: [
    'git'
  ]
}
