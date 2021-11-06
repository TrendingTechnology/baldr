import { Master } from '../master'

type NoteFieldsRaw = string | NoteFieldsNormalized

interface NoteFieldsNormalized {
  markup: string
}

export class NoteMaster implements Master {
  name = 'note'

  displayName = 'Hefteintrag'

  icon = {
    name: 'pencil',
    color: 'blue'
  }

  fieldsDefintion = {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
    },
    items: {
      type: Array
    },
    sections: {
      type: Array
    }
  }

  normalizeFields (fields: NoteFieldsRaw): NoteFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        markup: fields
      }
    }
    return fields
  }
}
