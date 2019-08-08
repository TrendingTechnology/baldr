import ModalDialog from './ModalDialog.vue'

const DEFAULT_NAME = 'modal-dialog'

const DEFAULT_OPTIONS = {
  body: 'cute-modal__body',
  container: 'cute-modal__container',
  footer: 'cute-modal__footer',
  header: 'cute-modal__header',
  height: 'auto',
  overlay: 'cute-modal__overlay',
  width: '600px',
  onOpen: null,
  onClose: null
}

const Plugin = {
  install (Vue, options = {}) {
    let name = DEFAULT_NAME
    this.event = new Vue()

    if (options.component) {
      name = options.component
    }

    Vue.prototype.$modal = {
      open (name) {
        Plugin.event.$emit('toggle', name)
      },

      hide (name) {
        Plugin.event.$emit('toggle', name)
      },

      options () {
        return Object.assign({}, DEFAULT_OPTIONS, options)
      }
    }

    Vue.component('modal-dialog', ModalDialog)
  }
}

export default Plugin
