import MaterialIconSFC from './MaterialIcon.vue'

export const MaterialIcon = MaterialIconSFC

const Plugin = {
  install (Vue) {
    Vue.component('material-icon', MaterialIconSFC)
  }
}

export const icons = [
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'dice-multiple',
  'magnify',
  'musescore',
  'table-of-contents',
  'wikidata',
  'wikipedia',
  'youtube'
]

export default Plugin
