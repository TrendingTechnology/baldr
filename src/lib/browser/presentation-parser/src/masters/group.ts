import { Master } from '../master'

export class GroupMaster implements Master {
  name = 'group'

  displayName = 'Gruppe'

  icon = {
    name: 'account-group',
    color: 'orange'
  }

  fieldsDefintion = {
    groupId: {
      type: String,
      required: true,
      description: 'Die ID der Gruppe (z. B. „Beatles_The“).'
    }
  }
}
