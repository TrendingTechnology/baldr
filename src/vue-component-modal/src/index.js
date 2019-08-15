import ModalDialog from './ModalDialog.vue'

class DialogsWatcher {

  constructor () {
    this.dialogs = {}
  }

  createDialog (name) {
    if (name in this.dialogs) {
      throw new Error(`<modal-dialog/> with the name “${name}” already exists.`)
    }
    this.dialogs[name] = null
  }

  setVisiblity (name, isVisible) {
    this.dialogs[name] = isVisible
  }

  isOpen () {
    for (const name in this.dialogs) {
      if (this.dialogs[name]) return true
    }
    return false
  }
}

export const dialogsWatcher = new DialogsWatcher()

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
      },
      isOpen () {
        return dialogsWatcher.isOpen()
      }
    }

    Vue.component('modal-dialog', ModalDialog)
  }
}

export default Plugin
