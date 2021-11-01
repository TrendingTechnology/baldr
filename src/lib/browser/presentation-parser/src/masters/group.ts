import { Master } from '../master'

export class GroupMaster extends Master {
  name = 'group'

  displayName = 'Gruppe'

  iconSpec = {
    name: 'account-group',
    color: 'orange'
  }
}
