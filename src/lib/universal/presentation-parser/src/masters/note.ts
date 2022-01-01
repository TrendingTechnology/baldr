import { MasterSpec, convertMarkdownToHtml, StepCollector } from '../master-specification'
import { buildTextStepController, wrapWords } from '@bldr/dom-manipulator'

export type NoteFieldsRaw = string | NoteFieldsInstantiated

interface NoteFieldsInstantiated {
  markup: string
}

export class NoteMaster implements MasterSpec {
  name = 'note'

  displayName = 'Hefteintrag'

  icon = {
    name: 'pencil',
    color: 'blue',

    /**
     * U+1F58B U+FE0F
     *
     * @see https://emojipedia.org/fountain-pen/
     */
     unicodeSymbol: '🖋️'
  }

  fieldsDefintion = {
    markup: {
      type: String,
      markup: true,
      description: 'Text im HTML- oder Markdown-Format oder als reiner Text.'
    }
  }

  shortFormField = 'markup'

  normalizeFieldsInput (
    fields: NoteFieldsInstantiated
  ): NoteFieldsInstantiated {
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

  collectStepsOnInstantiation (
    fields: NoteFieldsInstantiated,
    stepCollector: StepCollector
  ) {
    const controller = buildTextStepController(fields.markup, {
      stepMode: 'words'
    })
    stepCollector.add('Initiale Ansicht')

    for (const stepElement of controller.steps) {
      if (stepElement.text == null) {
        throw new Error('A step in the master slide “note” needs text!')
      }
      stepCollector.add(stepElement.text)
    }
  }
}
