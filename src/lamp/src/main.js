/**
 * The main app of the BALDR project: a presentation app using YAML files.
 *
 * # Structure of a master slide
 *
 * ## Files
 *
 * - `main.js`
 * - `main.vue`
 * - `preview.vue`
 * - `examples.baldr.yml`
 *
 * # Additional “dollar” properties (public instance properties) in the Vue
 *   instances.
 *
 * - `this.$dynamicSelect`
 * - `this.$fullscreen()`: Set presentation app to fullscreen.
 * - `this.$get(getterName)`: Shortcut for
 *   `this.$store.getters['lamp/getterName']`
 * - `this.$masters`
 * - `this.$media`
 * - `this.$modal`
 * - `this.$notify()`: An instance of the package `vue-notifications`.
 * - `this.$notifyError`
 * - `this.$notifySuccess`
 * - `this.$route`
 * - `this.$router`
 * - `this.$shortcuts`
 * - `this.$store`
 * - `this.$styleConfig`
 *
 * ```js
 * function mounted () {
 *   this.$styleConfig.setDefault()
 *
 *   // Set presentation app to fullscreen:
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
 * # Additional properties in the main master components:
 *
 * - `masterName`
 * - `master`
 *
 *
 * ## Additional `props` keys:
 *
 * - `description`: String to describe the property
 * - `markup` (boolean): The specified value can contain markup. The value can
 *    be written in Markdown and or in HTML. is converted into HTML. The key
 *    `type` has to be `String`.
 *
 * ```js
 * export const default = {
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
 *   store: {
 *     getters,
 *     actions,
 *     mutations
 *   }
 * }
 * ```
 *
 * # Hooks (exported master methods)
 *
 * The hooks are listed in call order:
 *
 * ## Called during the parsing the YAML file (`Praesentation.baldr.yml`):
 *
 * ### 1. `normalizeProps(props)`
 *
 * - `return`: an object.
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     // result must fit to props
 *     normalizeProps (props) {
 *       if (typeof props === 'string') {
 *         return {
 *           markup: props
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ### 2. `resolveMediaUris(props)`
 *
 * - `return`: an array or a string.
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     // An array of media URIs to resolve (like [id:beethoven, id:mozart.mp3])
 *     resolveMediaUris (props) {
 *       return props.src
 *     }
 *   }
 * }
 * ```
 *
 * ### 3. `afterLoading({ props, master })`
 *
 * Goes into the background.
 *
 * - `this`: is the main Vue instance.
 * - `return`: void.
 *
 * ```js
 * export const default = {
 *   hooks {
 *     async afterLoading ({ props, master }) {
 *       const body = await getHtmlBody(props.title, props.language)
 *       master.$commit('addBody', { id: formatId(props.language, props.title), body: body })
 *     }
 *   }
 * }
 * ```
 *
 * ### 4. `afterMediaResolution({ props, master })`
 *
 * Blocks.
 *
 * - `this`: is the main Vue instance.
 * - `return`: void.
 *
 * ```js
 * export const default = {
 *   hooks {
 *     async afterMediaResolution ({ props, master }) {
 *     }
 *   }
 * }
 * ```
 *
 * ### 5. `collectPropsMain(props)`
 *
 * - `this`: is the main Vue instance.
 * - `return`: an object.
 *
 * ```js
 * export const default = {
 * }
 * ```
 *
 * ### 6. `collectPropsPreview({ props, propsMain, slide })`
 *
 * - `this`: is the main Vue instance.
 * - `return`: an object.
 *
 * ```js
 * export const default = {
 * }
 * ```
 *
 * ### 7. `calculateStepCount({ props, propsMain, propsPreview, slide, master })`
 *
 * - `this`: is the main Vue instance.
 * - `return`: a number.
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     calculateStepCount ({ props, propsMain, propsPreview, slide }) {
 *       return props.src.length
 *     }
 *   }
 * }
 * ```
 *
 * ## Getter on the slide object:
 *
 * ### `titleFromProps(props)` ??? not implemented any more?
 *
 * - `return`: a string
 *
 * ```js
 * export const default = {
 *  }
 *  ```
 *
 * ### `plainTextFromProps(props)`
 *
 * - `return`: a string
 *
 * ```js
 * export const default = {
 * }
 * ```
 *
 * ## Slide change:
 *
 * ### 1. `leaveSlide ({ oldSlide, oldProps, newSlide, newProps })`
 *
 * This hook is only called on the public master component (the one that is
 * visible for the audience), not on further secondary master components (for
 * example the ad hoc slides or the future slide view in the speakers view.)
 *
 * - `this`: is the Vue instance of the current main master component.
 * - called from within the Vuex store in the file  `store.js`.
 * - `return`: void
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     // Called when leaving a slide.
 *     leaveSlide ({ oldSlide, oldProps, newSlide, newProps }) {
 *     }
 *   }
 * }
 *
 * ```
 *
 * ### 2. `enterSlide ({ oldSlide, oldProps, newSlide, newProps })`
 *
 * This hook is only called on the public master component (the one that is
 * visible for the audience), not on further secondary master components (for
 * example the ad hoc slides or the future slide view in the speakers view.)
 *
 * - `this`: is the Vue instance of the current main master component.
 * - called from within the Vuex store in the file  `store.js`.
 * - `return`: void
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     // Called when entering a slide.
 *     enterSlide ({ oldSlide, oldProps, newSlide, newProps }) {
 *     }
 *   }
 * }
 * ```
 *
 * ### 3. `afterSlideNoChangeOnComponent ({ oldSlideNo, newSlideNo })`
 *
 * - `this`: is the Vue instance of the current main master component.
 * - called from the master component mixin in the file `masters.js`.
 * - `return`: void
 *
 * ## Step change:
 *
 * ### 1. `leaveStep ({ oldStepNo, newStepNo })`
 *
 * This hook is only called on the public master component (the one that is
 * visible for the audience), not on further secondary master components (for
 * example the ad hoc slides or the future slide view in the speakers view.)
 *
 * - `this`: is the Vue instance of the current main master component.
 * - `return`: void
 * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     // Called when leaving a step.
 *     leaveStep ({ oldStepNo, newStepNo }) {
 *     }
 *   }
 * }
 * ```
 *
 * ### 2. `enterStep ({ oldStepNo, newStepNo })`
 *
 * This hook is only called on the public master component (the one that is
 * visible for the audience), not on further secondary master components (for
 * example the ad hoc slides or the future slide view in the speakers view.)
 *
 * - `this`: is the Vue instance of the current main master component.
 * - `return`: void
 * - called from the Vuex action `setStepNoCurrent` in the file `store.js`.
 *
 * ```js
 * export const default = {
 *   hooks: {
 *     // Called when entering a step.
 *     enterStep ({ oldStepNo, newStepNo }) {
 *       if (this.stepMode) {
 *         this.domSteps.displayByNo({
 *           oldStepNo,
 *           stepNo: this.stepNo
 *         })
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ### 3. `afterStepNoChangeOnComponent ({ oldStepNo, newStepNo, slideNoChange })`
 *
 * - `this`: is the Vue instance of the current main master component.
 * - called from the master component mixin in the file `masters.js`.
 * - `return`: void
 *
 * # Store
 *
 * Each master slide can get its own Vuex store module. The module is name like
 * `lampMaster${masterName}`, e. g. `lampMasterGeneric`.
 *
 * ```js
 * export const default = {
 *   store: {
 *     state,
 *     getters,
 *     actions,
 *     mutations
 *   }
 * }
 * ```
 *
 * @module @bldr/lamp
 */

/* globals config */

import Vue from 'vue'
import { registerMasterComponents, masters } from '@/masters.js'

// Vue plugins.
import router from '@/router.js'
import store from '@/store.js'
import notifications from 'vue-notification'
import shortcuts from '@bldr/vue-plugin-shortcuts'
import MaterialIcon from '@bldr/icons'
import ModalDialog from '@bldr/vue-plugin-modal-dialog'
import DynamicSelect from '@bldr/vue-plugin-dynamic-select'
import media from '@bldr/vue-plugin-media'
import Websocket from 'vue-native-websocket'

// Vue components.
import MainApp from '@/MainApp.vue'

Vue.use(shortcuts, router, store)
Vue.use(media, router, store, Vue.prototype.$shortcuts)
Vue.use(notifications)

Vue.use(DynamicSelect)
Vue.use(ModalDialog)
Vue.use(MaterialIcon)
Vue.use(Websocket, config.wire.localUri, {
  format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 5, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 3000 // (Number) how long to initially wait before attempting a new (1000)
})
Vue.config.productionTip = false

/** props definition **********************************************************/

/**
 * An extended version of the Vue `prop` definition.
 *
 * @typedef propDef
 * @property {Mixed} default - A default value.
 * @property {String} description - A descriptive text shown in the
 *   documentation.
 * @property {Boolean} inlineMarkup - Indicates that this `prop` is text for
 *   extracting inline media URIs like `[id:Beethoven_Ludwig-van]`.
 * @property {Boolean} markup - If true this property is converted into
 *   HTML.
 * @property {Boolean} mediaFileUri - Indicates that this `prop` contains
 *   a media file URI.
 * @property {Boolean} required - In the `prop` must specifed.
 * @property {Object|Array} type - The same as Vue `type`.
 * @type {Object}
 */

/**
 * An extended version of the Vue `props` defintion.
 *
 * ```js
 *  const props = {
 *    src: {
 *      default: 'id:Fuer-Elise'
 *      description: 'Den URI zu einer Video-Datei.',
 *      inlineMarkup: false
 *      markup: false
 *      mediaFileUri: true,
 *      required: true,
 *      type: String,
 *    }
 *  }
 * ```
 *
 * @see {@link @bldr/lamp~propDef}
 *
 * @typedef propsDef
 * @type {{Object.<propName, module:@bldr/lamp~propDef>}}
 */

/** props (with real world value) *********************************************/

/**
 * The value of the `props`.
 *
 * @typedef prop
 * @type {(String|Array|Boolean|Number)}
 */

/**
 * This `props` object gets processed and converted into Vue specific `props`
 * (`propsMain`, `propsPreview`).
 *
 * Master `task`:
 *
 * ```json
 * {
 *   "markup": "Warum klingen die Takte 23-26 schärfer als die Takte 1-4?"
 * }
 * ```
 *
 * Master `generic`:
 *
 * ```json
 * {
 *   "markup": [
 *     "<p>Ein aufheulendes Auto</p>\n<p>Die Ideen des Futurismus ..."
 *   ],
 *   "charactersOnSlide": 2000
 * }
 * ```
 *
 * Master `scoreSample`:
 *
 * ```json
 * {
 *   "score": "id:Milhauds-Corcovado_NB_Corcovado_Ausschnitt",
 *   "audio": "id:Milhauds-Corcovado_HB_Corcovado"
 * }
 * ```
 *
 * Master `camera`:
 *
 * ```json
 * true
 * ```
 *
 * Master `image`:
 *
 * ```json
 * {
 *   "src": "id:Milhauds-Corcovado_BD_Darius-Milhaud"
 * }
 * ```
 *
 * @typedef props
 * @type {{Object.<propName, module:@bldr/lamp~prop>}}
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
 * @property {styleConfig.darkMode}
 * @property {styleConfig.contentTheme}
 * @property {styleConfig.uiTheme}
 */

/**
 *
 */
class StyleConfig {
  constructor () {
    this.configObjects = {
      darkMode: new DarkMode(),
      contentTheme: new ContentTheme(),
      uiTheme: new UiTheme()
    }
  }

  /**
   * @private
   */
  defaults_ () {
    return {
      darkMode: false,
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
   * @param {module:@bldr/lamp~styleConfig} styleConfig
   */
  set (styleConfig) {
    if (!styleConfig) styleConfig = {}
    this.set_(Object.assign(this.defaults_(), styleConfig))
  }
}

/**
 * $styleConfig
 * @type {module:@bldr/lamp~StyleConfig}
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
 *
 * @params {(Object|String)} - An error object or a text for the notification.
 */
Vue.prototype.$notifyError = function (text, title) {
  if (typeof text === 'object') {
    const error = text
    text = error.message
    title = error.name
    console.log(error) // eslint-disable-line
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
}

/**
 * Shortcut for `this.$store.getters['lamp/getterName']`
 */
Vue.prototype.$get = function (getterName) {
  return store.getters[`lamp/${getterName}`]
}

/**
 * Go to one of the three presentation related routes: `slides-preview`, `slide`
 * or `slide-stop-no`
 *
 * @param {module:@bldr/lamp/content-file~routerParams} params
 */
Vue.prototype.$gotToPresRoute = function (params) {
  const route = router.currentRoute
  if (!params.presId) throw new Error('Params must have a property “presId”')

  // To avoid pushing to the same route.
  let areParamsEqual = true
  for (const prop in params) {
    if (params[prop] !== route.params[prop]) {
      areParamsEqual = false
      break
    }
  }

  let name
  if (params.stepNo) {
    name = 'slide-step-no'
  } else if (params.slideNo) {
    name = 'slide'
  } else {
    name = 'slides-preview'
  }

  if (name === route.name && areParamsEqual) return
  router.push({ name, params })
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

// To be able to store Vue component instances. If we store a vue component
// instance in a vuex store there were many errors raised.
export const customStore = {}
