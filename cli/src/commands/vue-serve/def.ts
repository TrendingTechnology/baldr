import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'vue-serve [app-name]',
  alias: 'vs',
  description: 'Serve a Vue web app.',
  checkExecutable: [
    'npm'
  ]
})
