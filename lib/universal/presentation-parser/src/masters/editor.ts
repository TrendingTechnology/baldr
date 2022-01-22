import {
  MasterSpec,
  mapStepFieldDefintions,
  convertMarkdownToHtml
} from '../master-specification'

type EditorFieldsRaw = string | EditorFieldsNormalized

interface EditorFieldsNormalized {
  markup: string
}

export const PLACEHOLDER = '…'
export const PLACEHOLDER_TAG = `<span class="editor-placeholder">${PLACEHOLDER}</span>`
export const DEFAULT_MARKUP = `<p contenteditable>${PLACEHOLDER_TAG}</p>`

export class EditorMaster implements MasterSpec {
  name = 'editor'

  displayName = 'Hefteintrag'

  icon = {
    name: 'master-editor',
    color: 'blue',

    /**
     * U+1F4DD
     *
     * @see https://emojipedia.org/memo/
     */
    unicodeSymbol: '📝'
  }

  fieldsDefintion = {
    markup: {
      type: String,
      markup: true,
      description:
        'Text im HTML oder Markdown Format oder natürlich als reiner Text.'
    },
    ...mapStepFieldDefintions(['mode', 'subset'])
  }

  normalizeFieldsInput (fields: EditorFieldsRaw): EditorFieldsNormalized {
    if (typeof fields === 'string') {
      fields = {
        markup: fields
      }
    }

    fields.markup = convertMarkdownToHtml(fields.markup)
    fields.markup = fields.markup.replace(
      />…</g,
      ` contenteditable>${PLACEHOLDER_TAG}<`
    )
    return fields
  }
}
