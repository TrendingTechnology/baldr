/**
 * @module @bldr/lamp/masters/quote
 */

import type { LampTypes } from '@bldr/type-definitions'

import { convertHtmlToPlainText } from '@bldr/core-browser'
import { validateMasterSpec } from '@bldr/lamp-core'

export default validateMasterSpec({
  name: 'quote',
  title: 'Zitat',
  propsDef: {
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
  },
  icon: {
    name: 'quote',
    color: 'brown',
    size: 'large'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  hooks: {
    normalizeProps (props): LampTypes.StringIndexedData {
      if (typeof props === 'string') {
        props = {
          text: props
        }
      }
      // Inject quotations marks after the first befor the last word character
      // <p><span class="quotation-mark">»</span>Quote
      props.text = props.text.replace(/^(\s*<.+>)?/, '$1<span class="quotation-mark">»</span> ')
      props.text = props.text.replace(/(<.+>\s*)?$/, ' <span class="quotation-mark">«</span>$1')
      return props
    },
    plainTextFromProps (props): string {
      return convertHtmlToPlainText(Object.values(props).join(' | '))
    }
  }
})
