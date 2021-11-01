import { Master } from '../master'

export class NoteMaster extends Master {
  name = 'note'

  displayName = 'Hefteintrag'

  iconSpec = {
    name: 'pencil',
    color: 'blue'
  }
}
