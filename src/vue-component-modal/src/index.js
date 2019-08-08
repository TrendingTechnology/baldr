import ModalDialog from './ModalDialog.vue'

const Plugin = {
  install (Vue) {
    this.event = new Vue()

    Vue.prototype.$modal = {
      open (name) {
        Plugin.event.$emit('toggle', name)
      },
      hide (name) {
        Plugin.event.$emit('toggle', name)
      }
    }

    Vue.component('modal-dialog', ModalDialog)
  }
}

export default Plugin
