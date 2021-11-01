import { Master } from '../master'

export class CameraMaster extends Master {
  name = 'camera'

  displayName = 'Dokumentenkamera'

  iconSpec = {
    name: 'document-camera',
    color: 'red'
  }
}
