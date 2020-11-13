import { CliCommandSpec } from '@bldr/type-definitions'

export = <CliCommandSpec> {
  command: 'open-vue-app [name]',
  alias: 'ova',
  checkExecutable: 'chromium-browser',
  description: 'Open a Vue app in Chromium.'
}
