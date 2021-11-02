import { Master } from '../master'

export class QuoteMaster extends Master {
  name = 'quote'

  displayName = 'Zitat'

  icon = {
    name: 'quote',
    color: 'brown',
    size: 'large' as const
  }

  fieldsDefintion = {
    text: {
      type: String,
      required: true,
      markup: true,
      description: 'Haupttext des Zitats.'
    },
    author: {
      type: String,
      description: 'Der Autor des Zitats.'
    },
    date: {
      type: [String, Number],
      description: 'Datum des Zitats.'
    },
    source: {
      type: String,
      markup: true,
      description: 'Die Quelle des Zitats'
    },
    prolog: {
      type: String,
      markup: true,
      description: 'Längerer Text, der vor dem Zitat erscheint.'
    },
    epilog: {
      type: String,
      markup: true,
      description: 'Längerer Text, der nach dem Zitat erscheint.'
    }
  }
}
