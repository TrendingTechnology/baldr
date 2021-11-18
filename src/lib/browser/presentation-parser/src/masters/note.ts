import { Master, convertMarkdownToHtml, wrapWords } from '../master'

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
    }
  }

  normalizeFields (fields: NoteFieldsRaw): NoteFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        markup: fields
      }
    }

    fields.markup = convertMarkdownToHtml(fields.markup)

    // hr tag
    if (fields.markup.indexOf('<hr>') > -1) {
      const segments = fields.markup.split('<hr>')
      const prolog = segments.shift()
      let body = segments.join('<hr>')
      body = '<span class="word-area">' + wrapWords(body) + '</span>'
      fields.markup = [prolog, body].join('')
      // No hr tag provided
      // Step through all words
    } else {
      fields.markup = wrapWords(fields.markup)
    }
    return fields
  }
}
