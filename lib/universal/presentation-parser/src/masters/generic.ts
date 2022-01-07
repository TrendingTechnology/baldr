import { shortenText } from '@bldr/string-format'
import {
  MasterSpec,
  convertMarkdownToHtml,
  splitHtmlIntoChunks,
  StepCollector
} from '../master-specification'

const CHARACTERS_ON_SLIDE = 400

type GenericFieldsRawInput = string | string[] | GenericFieldsInput

interface GenericFieldsInput {
  markup: string | string[]
  charactersOnSlide?: number
  onOne?: boolean
}

interface GenericFieldsInputFinal extends GenericFieldsInput {
  markup: string[]
  charactersOnSlide: number
  onOne: boolean
}

export function splitMarkup (
  rawMarkup: string | string[],
  charactersOnSlide: number
): string[] {
  if (typeof rawMarkup === 'string') {
    rawMarkup = [rawMarkup]
  }

  // Convert into HTML
  const converted = []
  for (const markup of rawMarkup) {
    converted.push(convertMarkdownToHtml(markup))
  }

  // Split by <hr>
  const splittedByHr = []
  for (const html of converted) {
    if (html.indexOf('<hr>') > -1) {
      const chunks = html.split('<hr>')
      for (const chunk of chunks) {
        splittedByHr.push(chunk.trim())
      }
    } else {
      splittedByHr.push(html)
    }
  }

  // Split large texts into smaller chunks
  let markup = []
  for (const html of splittedByHr) {
    const chunks = splitHtmlIntoChunks(html, charactersOnSlide)
    for (const chunk of chunks) {
      markup.push(chunk)
    }
  }

  return markup
}

export class GenericMaster implements MasterSpec {
  name = 'generic'

  displayName = 'Folie'

  icon = {
    name: 'file-presentation-box',
    color: 'gray',
    showOnSlides: false,

    /**
     * U+1F4C4
     *
     * @see https://emojipedia.org/page-facing-up/
     */
    unicodeSymbol: '📄'
  }

  fieldsDefintion = {
    markup: {
      required: true,
      // It is complicated to convert to prop based markup conversion.
      // markup: true
      inlineMarkup: true,
      description: 'Markup im HTML oder Markdown-Format'
    },
    charactersOnSlide: {
      type: Number,
      description:
        'Gibt an wie viele Zeichen auf einer Folie erscheinen sollen.',
      default: CHARACTERS_ON_SLIDE
    },
    onOne: {
      description:
        'Der ganze Text erscheint auf einer Folien. Keine automatischen Folienumbrüche.',
      type: Boolean,
      default: false
    }
  }

  normalizeFieldsInput (fields: GenericFieldsRawInput): GenericFieldsInput {
    if (typeof fields === 'string' || Array.isArray(fields)) {
      fields = { markup: fields }
    }
    return fields
  }

  collectFieldsOnInstantiation (
    fields: GenericFieldsInputFinal
  ): GenericFieldsInputFinal {
    fields.markup = splitMarkup(fields.markup, fields.charactersOnSlide)
    return fields
  }

  collectStepsOnInstantiation (
    fields: GenericFieldsInputFinal,
    stepCollector: StepCollector
  ) {
    for (const markup of fields.markup) {
      stepCollector.add(shortenText(markup, { stripTags: true, maxLength: 40 }))
    }
  }
}
