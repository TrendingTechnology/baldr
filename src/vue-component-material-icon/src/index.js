import MaterialIcon from './MaterialIcon.vue'

const Plugin = {
  install (Vue) {
    Vue.component('material-icon', MaterialIcon)
  }
}

export const icons = [
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'chevron-up',
  'musescore',
  'dice-multiple',
  'table-of-contents',
  'magnify',
  'wikipedia',
  'wikidata',
  'youtube'
]

export default Plugin
