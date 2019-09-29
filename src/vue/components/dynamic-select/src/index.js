import component from './DynamicSelect.vue'

export const DynamicSelect = component

const Plugin = {
  install (Vue) {
    this.event = new Vue()

    Vue.prototype.$dynamicSelect = {
      focus (name) {
        Plugin.event.$emit('dynamicselectfocus', name)
      }
    }
    Vue.component('dynamic-select', component)
  }
}

export default Plugin
