/**
 * Wrap some actions into function to make them available for
 * the ipcRenderer of the Electron main process.
 *
 * @module @bldr/lamp/actions
 */

import store from './store/index.js'

export default {
  resetSlideScaleFactor: () => store.dispatch('lamp/resetSlideScaleFactor'),
  increaseSlideScaleFactor: () => store.dispatch('lamp/increaseSlideScaleFactor'),
  decreaseSlideScaleFactor: () => store.dispatch('lamp/decreaseSlideScaleFactor')
}
