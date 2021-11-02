import { Master } from '../master'

export class NoteMaster extends Master {
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
}
