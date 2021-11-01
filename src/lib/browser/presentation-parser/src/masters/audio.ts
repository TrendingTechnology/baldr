import { Master } from '../master'

export class AudioMaster extends Master {
  name = 'audio'
  displayName = 'Hörbeispiel'

  iconSpec = {
    name: 'music',
    color: 'brown'
  }
}
