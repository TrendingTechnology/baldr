/**
 * A dynamic select form component made with Vue.
 *
 * @module @bldr/vue-component-dynamic-select
 */
import component from './DynamicSelect.vue'

export const DynamicSelect = component

const Plugin = {
  install (Vue) {
    this.event = new Vue()

    Vue.prototype.$dynamicSelect = {
      focus () {
        Plugin.event.$emit('dynamicselectfocus')
      }
    }
    Vue.component('dynamic-select', component)
  }
}

export default Plugin
