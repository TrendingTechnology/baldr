/**
 * The main app of the BALDR project: a presentation app using YAML files.
 *
 * @module @bldr/lamp
 */

/* globals config */

// Must be first import
import './lib/components'

import Vue from 'vue'

import './masters.js'

import { registerMasterComponents } from './lib/masters'

// Vue plugins.
import { router } from '@/lib/router-setup'
import store from '@/store/index.js'
import shortcuts from '@bldr/shortcuts'
import MaterialIcon from '@bldr/icons'
import ModalDialog from '@bldr/modal-dialog'
import DynamicSelect from '@bldr/dynamic-select'
import media from '@bldr/media-client'
import Websocket from 'vue-native-websocket'
import Notification from '@bldr/notification'
import Player from '@bldr/player'
import { resolver } from '@bldr/presentation-parser'

// Vue components.
import MainApp from '@/components/linked-by-routes/MainApp.vue'

Vue.use(shortcuts, { router, store })
Vue.use(media, router, store, Vue.prototype.$shortcuts)
Vue.use(Notification)

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.use(Websocket, config.wire.localUri, {
  format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
})

Vue.use(Player, resolver)

Vue.config.productionTip = false

// Must be before new Vue()
registerMasterComponents()

store.subscribe(mutation => {
  if (mutation.type === 'media/addAsset') {
    const asset = mutation.payload
    if (asset.uriScheme === 'localfile') {
      Vue.prototype.$showMessage.success(
        `hinzugefügt: <a href="${asset.routerLink}">${asset.filename}</a>.`
      )
    }
  }
})

/**
 * Shortcut for `this.$store.getters['lamp/getterName']`
 */
Vue.prototype.$get = function (getterName: string) {
  return store.getters[`lamp/${getterName}`]
}

// On Firefox: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0
// On Electron: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) @bldr/lamp/0.2.4 Chrome/85.0.4183.98 Electron/10.1.2 Safari/537.36
const userAgent = navigator.userAgent.toLowerCase()

Vue.prototype.$isElectron = userAgent.indexOf('electron') > -1

/**
 * The main vue instance
 */
const vm = new Vue({
  router,
  store,
  render: h => h(MainApp)
}).$mount('#app')

export default vm

interface CustomStore {
  vueMasterInstanceCurrent?: typeof vm
}

// To be able to store Vue component instances. If we store a vue component
// instance in a vuex store there were many errors raised.
export const customStore: CustomStore = {}
