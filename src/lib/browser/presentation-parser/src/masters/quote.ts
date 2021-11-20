import { Master } from '../master'

type QuoteFieldsRaw = string | QuoteFieldsNormalized

interface QuoteFieldsNormalized {
  text: string
  author?: string
  date?: string
  source?: string
  prolog?: string
  epilog?: string
}

export class QuoteMaster implements Master {
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

  normalizeFieldsInput (fields: QuoteFieldsRaw): QuoteFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        text: fields
      }
    }
    // Inject quotations marks after the first before the last word character
    // <p><span class="quotation-mark">»</span>Quote
    fields.text = fields.text.replace(
      /^(\s*<.+>)?/,
      '$1<span class="quotation-mark">»</span> '
    )
    fields.text = fields.text.replace(
      /(<.+>\s*)?$/,
      ' <span class="quotation-mark">«</span>$1'
    )
    return fields
  }
}
