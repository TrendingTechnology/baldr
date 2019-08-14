import MaterialIconSFC from './MaterialIcon.vue'

export const MaterialIcon = MaterialIconSFC

const Plugin = {
  install (Vue) {
    Vue.component('material-icon', MaterialIconSFC)
  }
}

export const icons = [
  'account-star-outline',
  'air-filter',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'close',
  'dice-multiple',
  'file-outline',
  'magnify',
  'musescore',
  'notebook',
  'table-of-contents',
  'video-switch',
  'wikidata',
  'wikipedia',
  'youtube'
]

export default Plugin
