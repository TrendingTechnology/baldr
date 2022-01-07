import { MasterSpec, mapStepFieldDefintions } from '../master-specification'

type EditorFieldsRaw = string | EditorFieldsNormalized

interface EditorFieldsNormalized {
  markup: string
}

export class EditorMaster implements MasterSpec {
  name = 'editor'

  displayName = 'Hefteintrag'

  icon = {
    name: 'pencil',
    color: 'blue',

    /**
     * U+1F4DD
     *
     * @see https://emojipedia.org/memo/
     */
    unicodeSymbol: '📝'
  }

  fieldsDefintion = {
    markup: {
      type: String,
      markup: true,
      description:
        'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    },
    ...mapStepFieldDefintions(['mode', 'subset'])
  }

  normalizeFieldsInput (fields: EditorFieldsRaw): EditorFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        markup: fields
      }
    }
    return fields
  }
}
