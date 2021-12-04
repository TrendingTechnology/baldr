/**
 * Vue app of the baldr songbook.
 *
 * @module @bldr/songbook
 */
import { Vue } from '@bldr/vue-packages-bundler'
import router from './router'
import store from './store'

// Component packages.
import ModalDialog from '@bldr/modal-dialog'
import DynamicSelect from '@bldr/dynamic-select'
import MaterialIcon from '@bldr/icons'
import shortcuts from '@bldr/shortcuts'
import media from '@bldr/media-client'

// Components.
import MainApp from './MainApp.vue'

Vue.use(shortcuts, router, store)
Vue.use(media, router, store, Vue.prototype.$shortcuts)

Vue.use(MaterialIcon)
Vue.use(ModalDialog as any)
Vue.use(DynamicSelect as any)

Vue.config.productionTip = false

Vue.prototype.$fullscreen = function () {
  document.querySelector('.vc_main_app')?.requestFullscreen()
}

new Vue({
  router,
  store,
  render: h => h(MainApp)
}).$mount('#app')
