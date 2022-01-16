import { MasterSpec } from '../master-specification'

export class CameraMaster implements MasterSpec {
  name = 'camera'

  displayName = 'Dokumentenkamera'

  icon = {
    name: 'master-camera',
    color: 'red',

    /**
     * U+1F4F7
     *
     * @see https://emojipedia.org/camera/
     */
    unicodeSymbol: '📷'
  }

  fieldsDefintion = {}

  normalizeFieldsInput (fields: any): any {
    return {}
  }
}
