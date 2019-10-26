/**
 * Vue app of the baldr songbook.
 *
 * @module @bldr/vue-app-songbook
 */
import Vue from 'vue'
import router from './router'
import store from './store'

// Component packages.
import ModalDialog from '@bldr/vue-plugin-modal-dialog'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'
import MaterialIcon from '@bldr/vue-plugin-material-icon'
import shortcuts from '@bldr/vue-plugin-shortcuts'
import media from '@bldr/vue-plugin-media'

// Components.
import MainApp from './MainApp.vue'

Vue.use(shortcuts, router, store)
Vue.use(media, router, store, Vue.prototype.$shortcuts)

Vue.use(MaterialIcon)
Vue.use(ModalDialog)
Vue.use(DynamicSelect)

Vue.config.productionTip = false

Vue.prototype.$fullscreen = function () {
  document.querySelector('.vc_main_app').requestFullscreen()
}

new Vue({
  router,
  store,
  render: h => h(MainApp)
}).$mount('#app')
