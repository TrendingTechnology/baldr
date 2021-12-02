/**
 * A simple modal dialog component implementation in Vue.
 *
 * @module @bldr/vue-component-modal-dialog
 */
import ModalDialog from './ModalDialog.vue'

/**
 *
 */
class DialogsWatcher {
  constructor () {
    this.dialogs = {}
  }

  /**
   * @param {String} name - The name of the modal dialog, corresponds to the
   *   `prop` of the Vue component.
   */
  createDialog (name) {
    if (name in this.dialogs) {
      throw new Error(`<modal-dialog/> with the name “${name}” already exists.`)
    }
    this.dialogs[name] = null
  }

  /**
   * @param {String} name - The name of the modal dialog, corresponds to the
   *   `prop` of the Vue component.
   */
  destroyDialog (name) {
    if (name in this.dialogs) {
      delete this.dialogs[name]
    }
  }

  /**
   *
   * @param {String} name - The name of the modal dialog, corresponds to the
   *   `prop` of the Vue component.
   * @param {Boolean} isVisible
   */
  setVisiblity (name, isVisible) {
    this.dialogs[name] = isVisible
  }

  /**
   * Get the visibility of a modal dialog by its name.
   *
   * @param {String} name - The name of the modal dialog, corresponds to the
   *   `prop` of the Vue component.
   */
  getVisiblity (name) {
    this.dialogs[name]
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
        return dialogsWatcher.getVisiblity(name)
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
