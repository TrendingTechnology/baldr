import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

import MaterialIcon from '@bldr/vue-component-material-icon'
import ModalDialog from '@bldr/vue-component-modal-dialog'
import DynamicSelect from '@bldr/vue-component-dynamic-select'

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

class BodyAttributes {
  constructor () {
    this.attributeName = ''
    this.state = false
  }

  toggle () {
    this.set(!this.state)
  }

  set (state = false) {
    if (typeof state !== 'boolean') {
      state = this.state
    }
    document.querySelector('body').setAttribute(this.attributeName, state)
    this.state = state
  }
}

class CenterVertically extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-center-vertically'
    this.state = true
  }
}

Vue.prototype.$centerVertically = new CenterVertically()

class DarkMode extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-dark-mode'
    this.state = false
  }
}

Vue.prototype.$darkMode = new DarkMode()
// https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js
// https://webpack.js.org/guides/dependency-management/#require-context
const requireComponent = require.context(
  // Look for files in the current directory
  './masters',
  // Do not look in subdirectories
  false,
  // Only include "_base-" prefixed .vue files
  /[\w-]+\.vue$/
)

const masters = {}

// For each matching file name...
requireComponent.keys().forEach((fileName) => {
  // Get the component config
  const componentConfig = requireComponent(fileName)
  const master = componentConfig.master

  masters[master.name] = master
  // Get the PascalCase version of the component name
  const componentName = upperFirst(
    camelCase(
      fileName
        // Remove the "./_" from the beginning
        .replace(/^\.\/_/, '')
        // Remove the file extension from the end
        .replace(/\.\w+$/, '')
    )
  )
  // Globally register the component
  Vue.component(componentName, componentConfig.default)
})

Vue.prototype.$masters = masters

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
