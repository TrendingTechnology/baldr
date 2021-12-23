/**
 * `id`: `language:title` for example `de:Wolfgang_Amadeus_Mozart`
 *
 * @module @bldr/lamp/masters/wikipedia
 */

import { validateMasterSpec } from '@bldr/lamp-core'

import { wikipediaMaster } from '@bldr/presentation-parser'

const defaultLanguage = 'de'

export default validateMasterSpec({
  name: 'wikipedia',
  title: 'Wikipedia',
  propsDef: {
    title: {
      type: String,
      required: true,
      description:
        'Der Titel des Wikipedia-Artikels (z. B. „Ludwig_van_Beethoven“).'
    },
    language: {
      type: String,
      description:
        'Der Sprachen-Code des gewünschten Wikipedia-Artikels (z. B. „de“, „en“).',
      default: defaultLanguage
    },
    oldid: {
      type: Number,
      description: 'Eine alte Version verwenden.'
    }
  },
  icon: {
    name: 'wikipedia',
    color: 'black'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  hooks: {
    normalizeProps (props) {
      if (typeof props === 'string') {
        // de:Wolfgang_Amadeus_Mozart
        const regExp = new RegExp(/^([a-z]+):(.+)$/)
        const match = props.match(regExp)
        if (match) {
          props = {
            title: match[2],
            language: match[1]
          }
        } else {
          // Wolfgang_Amadeus_Mozart
          props = { title: props }
        }
      }
      if (!props.language) props.language = defaultLanguage
      return props
    },
    async afterLoading ({ props }) {
      await wikipediaMaster.queryHtmlBody(props.title, props.language, props.oldid)
      await wikipediaMaster.queryFirstImage(props.title, props.language)
    },
    collectPropsMain (props) {
      const p = props as wikipediaMaster.WikipediaFieldsNormalized
      return {
        title: props.title,
        language: props.language,
        id: wikipediaMaster.formatWikipediaId(props.language, props.title),
        oldid: props.oldid,
        httpUrl: wikipediaMaster.formatUrl(p)
      }
    },
    collectPropsPreview ({ propsMain }) {
      return {
        title: propsMain.title,
        id: propsMain.id
      }
    },
    plainTextFromProps (props) {
      return `${props.title} (${props.language})`
    }
  }
})
