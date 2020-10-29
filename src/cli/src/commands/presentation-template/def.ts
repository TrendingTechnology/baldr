import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'presentation-template [path]',
  alias: 'p',
  options: [
    ['-f, --force', 'Overwrite an existing presentation file.']
  ],
  description: 'Create a presentation template from the assets of the current working directory named “Praesentation.baldr.yml”.'
}
