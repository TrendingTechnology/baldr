import MaterialIconSFC from './MaterialIcon.vue'
import CircleIconSFC from './CircleIcon.vue'

import iconsJson from './icons.json'

export const icons = iconsJson
export const MaterialIcon = MaterialIconSFC
export const CircleIcon = CircleIconSFC

const Plugin = {
  install (Vue) {
    Vue.component('material-icon', MaterialIconSFC)
    Vue.component('circle-icon', CircleIconSFC)
  }
}

export default Plugin
