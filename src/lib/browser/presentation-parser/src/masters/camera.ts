import { Master } from '../master'

export class CameraMaster implements Master {
  name = 'camera'

  displayName = 'Dokumentenkamera'

  icon = {
    name: 'document-camera',
    color: 'red'
  }
}
