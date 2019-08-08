import ModalDialog from './ModalDialog.vue'

const Plugin = {
  install (Vue) {
    this.event = new Vue()

    Vue.prototype.$modal = {
      hide (name) {
        Plugin.event.$emit('modalhide', name)
      },
      toggle (name) {
        Plugin.event.$emit('modaltoggle', name)
      },
      show (name) {
        Plugin.event.$emit('modalshow', name)
      }
    }

    Vue.component('modal-dialog', ModalDialog)
  }
}

export default Plugin
