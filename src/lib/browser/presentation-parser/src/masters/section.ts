import { Master } from '../master'

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
}
