import { Master, mapStepFieldDefintions } from '../master'

type EditorFieldsRaw = string | EditorFieldsNormalized

interface EditorFieldsNormalized {
  markup: string
}

export class EditorMaster implements Master {
  name = 'editor'

  displayName = 'Hefteintrag'

  icon = {
    name: 'pencil',
    color: 'blue'
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

  normalizeFields (fields: EditorFieldsRaw): EditorFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        markup: fields
      }
    }
    return fields
  }
}
