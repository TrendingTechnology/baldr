import { Master } from '../master'

type SectionFieldsRaw = string | SectionFieldsNormalized

interface SectionFieldsNormalized {
  heading: string
}

export class SectionMaster implements Master {
  name = 'section'

  displayName = 'Abschnitt'

  icon = {
    name: 'file-tree',
    color: 'orange-dark'
  }

  fieldsDefintion = {
    heading: {
      type: String,
      required: true,
      markup: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    }
  }

  normalizeFields (fields: SectionFieldsRaw): SectionFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        heading: fields
      }
    }
    return fields
  }
}
