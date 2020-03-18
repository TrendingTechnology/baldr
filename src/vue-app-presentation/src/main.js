/**
 * The main app of the BALDR project: a presentation app using YAML files.
 *
 * ```js
 * function mounted () {
 *  this.$styleConfig.setDefault()
 *
 *  // Set presentation app to fullscreen:
 *   this.$fullscreen()
 *
 *   // vue-notifications
 *   this.$notify({
 *     group: 'default',
 *     type: 'error',
 *     title: 'Important message',
 *     text: 'Hello user! This is a notification!'
 *   })
 * }
 * ```
 *
 * # Structure of a master slide
 *
 * A master slide is a extended Vuejs component. You have to export a additional
 * object called `master`.
 *
 * File name: `name.vue`
 *
 * The master name is: `name`
 *
 * ## Additional `props` keys:
 *
 * - `description`: String to describe the property
 * - `markup` (boolean): The specified value can contain markup. The value can
 *    be written in Markdown and or in HTML. is converted into HTML. The key
 *    `type` has to be `String`.
 *
 * ```js
 * export const master = {
 *   title: 'Bild',
 *   icon: 'file-image',
 *   color: 'green',
 *   styleConfig: {
 *     darkMode: false,
 *     overflow: false,
 *     slidePadding: '4vw',
 *     contentTheme: 'default',
 *     uiTheme: 'default'
 *   },
 *   documentation = `# Markdown`,
 *   example: `
 * slides:
 * - title: 'URL: id:'
 *   image:
 *     src: id:Haydn
 * `,
 *   store: {
 *     getters,
 *     actions,
 *     mutations
 *   },
 *   // result must fit to props
 *   normalizeProps (props) {
 *     if (typeof props === 'string') {
 *       return {
 *         markup: props
 *       }
 *     }
 *   },
 *   calculateStepCount (props) {
 *     return props.src.length
 *   },
 *   // An array of media URIs to resolve (like [id:beethoven, filename:mozart.mp3])
 *   resolveMediaUris (props) {
 *     return props.src
 *   },
 *   plainTextFromProps (props) {
 *   },
 *   // Called when entering a slide.
 *   enterSlide ({ oldSlide, oldProps, newSlide, newProps }) {
 *   },
 *   // Called when leaving a slide.
 *   leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
 *   }
 *   // Called when entering a step.
 *   enterStep ({ oldStepNo, newStepNo }) {
 *   },
 *   // Called when leaving a step.
 *   leaveStep ({ oldStepNo, newStepNo }) {
 *   }
 * }
 * ```
 *
 * @module @bldr/vue-app-presentation
 */

import Vue from 'vue'
import { registerMasterComponents, masters } from '@/masters.js'

// Vue plugins.
import router from '@/router.js'
import store from '@/store.js'
import notifications from 'vue-notification'
import shortcuts from '@bldr/vue-plugin-shortcuts'
import MaterialIcon from '@bldr/vue-plugin-material-icon'
import ModalDialog from '@bldr/vue-plugin-modal-dialog'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'
import media from '@bldr/vue-plugin-media'

// Vue components.
import MainApp from '@/MainApp.vue'

Vue.use(shortcuts, router, store)
Vue.use(media, router, store, Vue.prototype.$shortcuts)
Vue.use(notifications)

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.config.productionTip = false

/**
 * An extended version of the Vue `prop`.
 *
 * TODO: rename to propDef
 *
 * @typedef prop
 * @property {Mixed} prop.default - A default value.
 * @property {String} prop.description - A descriptive text shown in the
 *   documentation.
 * @property {Boolean} prop.inlineMedia - Indicates that this `prop` is text for
 *   extracting inline media URIs like `[id:Beethoven_Ludwig-van]`.
 * @property {Boolean} prop.markup - If true this property is converted into
 *   HTML.
 * @property {Boolean} prop.mediaFileUri - Indicates that this `prop` contains
 *   a media file URI.
 * @property {Boolean} prop.required - In the `prop` must specifed.
 * @property {Object|Array} prop.type - Same as Vue `type`.
 * @type {Object}
 */

/**
 * An extended version of the Vue `props`.
 *
 * TODO: rename to propDefs / split?
 *
 * ```js
 *  const props = {
 *    src: {
 *      default: 'id:Fuer-Elise'
 *      description: 'Den URI zu einer Video-Datei.',
 *      inlineMedia: false
 *      markup: false
 *      mediaFileUri: true,
 *      required: true,
 *      type: String,
 *    }
 *  }
 * ```
 *
 * This object gets processed and converted into Vue specific props
 * (`propsMain`, `propsPreview`).
 *
 * ```js
 * createElement('example-master', { props: propsMain })
 * ```
 *
 * @typedef props
 * @type {{Object.<propName, module:@bldr/vue-app-presentation~prop>}}
 */

/******************************************************************************/

/**
 * Set multiple attributes at the same time
 */
class MultipleAttributes {
  constructor () {
    this.attributeName = ''
  }

  set (value) {
    const elements = document.querySelectorAll(`[${this.attributeName}]`)
    for (const element of elements) {
      // Preview slide editor has content-theme handwriting, which should
      // be anchangeable.
      if (
        this.attributeName !== 'b-content-theme' ||
            (
              this.attributeName === 'b-content-theme' &&
              !element.attributes['b-content-theme-unchangeable']
            )
      ) {
        element.attributes[this.attributeName].value = value
      }
    }
  }
}

/**
 *
 */
class BodyAttributes {
  constructor () {
    this.attributeName = ''
    this.state = false
    this.bodyEl_ = document.querySelector('body')
  }

  toggle () {
    this.set(!this.state)
  }

  set (state = false) {
    this.bodyEl_.setAttribute(this.attributeName, state)
    this.state = state
  }
}

/**
 *
 */
class CenterVertically extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-center-vertically'
    this.state = true
  }
}

/**
 *
 */
class DarkMode extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-dark-mode'
    this.state = false
  }
}

/**
 *
 */
class Overflow extends BodyAttributes {
  constructor () {
    super()
    this.attributeName = 'b-overflow'
    this.state = true
  }
}

/**
 *
 */
class ContentTheme extends MultipleAttributes {
  constructor () {
    super()
    this.attributeName = 'b-content-theme'
  }
}

/**
 *
 */
class UiTheme extends MultipleAttributes {
  constructor () {
    super()
    this.attributeName = 'b-ui-theme'
  }
}

/**
 * @typedef styleConfig
 * @type {object}
 * @property {styleConfig.centerVertically}
 * @property {styleConfig.darkMode}
 * @property {styleConfig.overflow}
 * @property {styleConfig.contentTheme}
 * @property {styleConfig.uiTheme}
 */

/**
 *
 */
class StyleConfig {
  constructor () {
    this.configObjects = {
      centerVertically: new CenterVertically(),
      darkMode: new DarkMode(),
      overflow: new Overflow(),
      contentTheme: new ContentTheme(),
      uiTheme: new UiTheme()
    }
  }

  /**
   * @private
   */
  defaults_ () {
    return {
      centerVertically: true,
      darkMode: false,
      overflow: false,
      contentTheme: 'default',
      uiTheme: 'default'
    }
  }

  setDefaults () {
    this.set_(this.defaults_())
  }

  /**
   * @private
   */
  set_ (styleConfig) {
    for (const config in styleConfig) {
      if (config in this.configObjects) {
        this.configObjects[config].set(styleConfig[config])
      } else {
        throw new Error(`Unkown style config “${config}”.`)
      }
    }
  }

  /**
   * @param {module:@bldr/vue-app-presentation~styleConfig} styleConfig
   */
  set (styleConfig) {
    if (!styleConfig) styleConfig = {}
    this.set_(Object.assign(this.defaults_(), styleConfig))
  }
}

/**
 * $styleConfig
 * @type {module:@bldr/vue-app-presentation~StyleConfig}
 */
Vue.prototype.$styleConfig = new StyleConfig()

/**
 * $notifySuccess
 */
Vue.prototype.$notifySuccess = function (text, title) {
  const notification = {
    group: 'default',
    text,
    duration: 5000,
    type: 'success'
  }
  if (title) notification.title = title
  Vue.prototype.$notify(notification)
}

/**
 * $notifyError
 */
Vue.prototype.$notifyError = function (text, title) {
  if (typeof text === 'object') {
    const error = text
    text = error.message
    title = error.name
  }
  const notification = {
    group: 'default',
    text,
    duration: -1, // forever
    type: 'error'
  }
  if (title) notification.title = title
  Vue.prototype.$notify(notification)
}

/******************************************************************************/

/**
 * $master
 */
Vue.prototype.$masters = masters

// https://stackoverflow.com/a/45032366/10193818
Vue.prototype.$fullscreen = function () {
  document.documentElement.requestFullscreen()
}

// Must be before new Vue()
registerMasterComponents()

store.subscribe((mutation, state) => {
  if (mutation.type === 'media/addMediaFile') {
    const mediaFile = mutation.payload
    if (mediaFile.uriScheme === 'localfile') {
      Vue.prototype.$notifySuccess(`hinzugefügt: <a href="${mediaFile.routerLink}">${mediaFile.filename}</a>.`)
    }
  }
})

Vue.config.errorHandler = function (error, vm, info) {
  vm.$notifyError(error)
  console.log(error)
}

/**
 * The main vue instance
 * @namespace Vue
 *
 * @type {object}
 */
const vue = new Vue({
  router,
  store,
  render: h => h(MainApp)
}).$mount('#app')

export default vue

// To be able to store Vue compoment instances. If we store a vue component
// instance in a vuex store there are many errors raised.
export const customStore = {}
