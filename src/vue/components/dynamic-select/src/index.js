import DynamicSelect from './DynamicSelect.vue'

const Plugin = {
  install (Vue) {
    this.event = new Vue()

    Vue.prototype.$dynamicSelect = {
      focus (name) {
        Plugin.event.$emit('dynamicselectfocus', name)
      }
    }

    Vue.component('dynamic-select', DynamicSelect)
  }
}

export default Plugin
