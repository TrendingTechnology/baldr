/**
 * Vue app of the baldr songbook.
 *
 * @module @bldr/songbook-vue-app
 */
import Vue from 'vue'
import router from './router'
import store from './store'

// Component packages.
import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'
import MaterialIcon from '@bldr/vue-component-material-icon'
import shortcuts from '@bldr/vue-shortcuts'
import media from '@bldr/vue-media'

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
