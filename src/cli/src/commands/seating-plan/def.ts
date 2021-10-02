import { validateDefintion } from '../../main.js'

export = validateDefintion({
  command: 'seating-plan <notenmanager-mdb>',
  alias: 'sp',
  description: 'Convert the MDB (Access) file to json.',
  checkExecutable: [
    'mdb-export'
  ]
})
