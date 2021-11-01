import { Master } from '../master'

export class SongMaster extends Master {
  name = 'song'

  displayName = 'Lied'

  iconSpec = {
    name: 'file-audio',
    color: 'green'
  }
}
