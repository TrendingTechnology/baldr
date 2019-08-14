import MaterialIconSFC from './MaterialIcon.vue'

import iconsJson from './icons.json'

export const icons = iconsJson
export const MaterialIcon = MaterialIconSFC

const Plugin = {
  install (Vue) {
    Vue.component('material-icon', MaterialIconSFC)
  }
}


export default Plugin
