import { Master } from '../master'

export class CameraMaster extends Master {
  name = 'camera'

  displayName = 'Dokumentenkamera'

  icon = {
    name: 'document-camera',
    color: 'red'
  }
}
