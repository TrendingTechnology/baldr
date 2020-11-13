import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'open-with-archives [path]',
  alias: 'owa',
  options: [
    ['-c, --create-dirs', 'Create missings directories of the relative path, if they are not existent.']
  ],
  checkExecutable: 'xdg-open',
  description: 'Create a relative path in different base paths. Open this relative paths in the file manager.'
}
