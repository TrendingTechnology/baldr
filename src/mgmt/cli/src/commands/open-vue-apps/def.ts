import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'open-vue-app [name]',
  alias: 'ova',
  checkExecutable: 'chromium-browser',
  description: 'Open a Vue app in Chromium.'
})
