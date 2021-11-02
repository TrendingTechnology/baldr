import { Master } from '../master'

export class SongMaster implements Master {
  name = 'song'

  displayName = 'Lied'

  icon = {
    name: 'file-audio',
    color: 'green'
  }

  fieldsDefintion = {
    songId: {
      type: String,
      description: 'Die ID des Liedes'
    }
  }
}
