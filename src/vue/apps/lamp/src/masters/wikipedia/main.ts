/**
 * `id`: `language:title` for example `de:Wolfgang_Amadeus_Mozart`
 *
 * @module @bldr/lamp/masters/wikipedia
 */

import { validateMasterSpec } from '@bldr/lamp-core'

import {
  getHtmlBody,
  formatId,
  formatUrl,
  getFirstImage,
  MasterProps
} from '@bldr/wikipedia'

import { Vue } from '@bldr/vue-packages-bundler'

const defaultLanguage = 'de'

interface State {
  thumbnailUrls: {
    [id: string]: string
  }
  bodies: {
    [id: string]: string
  }
}

const state: State = {
  thumbnailUrls: {},
  bodies: {}
}

const getters = {
  bodyById: (state: State) => (id: string) => {
    if (state.bodies[id]) {
      return state.bodies[id]
    }
  },
  thumbnailUrlById: (state: State) => (id: string) => {
    if (state.thumbnailUrls[id]) {
      return state.thumbnailUrls[id]
    }
  }
}

const mutations = {
  addBody (state: State, { id, body }: any) {
    Vue.set(state.bodies, id, body)
  },
  addThumbnailUrl (state: State, { id, thumbnailUrl }: any) {
    Vue.set(state.thumbnailUrls, id, thumbnailUrl)
  }
}

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
  store: {
    state,
    getters,
    mutations
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
    async afterLoading ({ props, master }) {
      const id = formatId(props.language, props.title)
      const body = await getHtmlBody(props.title, props.language, props.oldid)
      if (body) {
        master.$commit('addBody', { id, body })
      }
      const thumbnailUrl = await getFirstImage(props.title, props.language)
      if (thumbnailUrl) {
        master.$commit('addThumbnailUrl', { id, thumbnailUrl })
      }
    },
    collectPropsMain (props) {
      const p = props as MasterProps
      return {
        title: props.title,
        language: props.language,
        id: formatId(props.language, props.title),
        oldid: props.oldid,
        httpUrl: formatUrl(p)
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
