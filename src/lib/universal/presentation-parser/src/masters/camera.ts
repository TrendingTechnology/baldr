import { Master } from '../master'

export class CameraMaster implements Master {
  name = 'camera'

  displayName = 'Dokumentenkamera'

  icon = {
    name: 'document-camera',
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
