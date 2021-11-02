import { Master } from '../master'

export class EditorMaster extends Master {
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
      description: 'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    }
  }
}
