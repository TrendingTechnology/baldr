/**
 * Gather informations about all masters.
 *
 * @module @bldr/lamp/masters
 */

/* globals rawYamlExamples */

import vue, { customStore } from '@/main.js'
import Vue from 'vue'
import store from '@/store.js'
import { markupToHtml, validateUri } from '@/lib.js'
import SlidePreviewPlayButton from '@/routes/SlidesPreview/PlayButton.vue'
import inlineMarkup from '@/inline-markup.js'
import { toTitleCase } from '@bldr/core-browser'

/**
 * The icon of a master slide. This icon is shown in the documentation or
 * on the left corner of a slide.
 */
class MasterIcon {
  constructor ({ name, color, size, showOnSlides }) {
    if (size && !['small', 'large'].includes(size)) {
      throw new Error(`The property “size” of the “MasterIcon” has to be “small” or “large” not ${size}`)
    }

    if (showOnSlides !== undefined && typeof showOnSlides !== 'boolean') {
      throw new Error(`The property “showOnSlide” of the “MasterIcon” has to be “boolean” not ${showOnSlides}`)
    }
    /**
     * For allowed icon names the materical icon font. The nasizeme of an icon
     * of the {@link module:@bldr/icons baldr icon font}
     *
     * @type {String}
     */
    this.name = name

    /**
     * A color name (CSS color class name) to colorize the master icon.
     * @see {@link module:@bldr/themes}
     *
     * @type {String}
     */
    this.color = color || 'orange'

    /**
     * Show the icon the on slide view.
     *
     * @type {Boolean}
     */
    this.showOnSlides = showOnSlides !== false

    /**
     * `small` or `large`
     *
     * @type {String}
     */
    this.size = size || 'small'
  }
}

/**
 * Each master slide is a instance of this class. This class has many dummy
 * methods. They are there for documentation reasons. On the other side they
 * are useful as default methods. You have not to check if a master slide
 * implements a specific hook.
 */
class Master {
  /**
   * @param {Object} specs - The default exported object from the `main.js`
   * file.
   */
  constructor (specs) {
    /**
     * It is the same as the parent folder where all master files are located,
     * for example `masters/audio/main.js`. The master name is `audio`.
     * @type {string}
     */
    this.name = null

    /**
     * The human readable title of the master slide.
     *
     * @type {String}
     */
    this.title = null

    /**
     * A instance of `MasterIcon` which holds information about the master icon.
     *
     * @type {module:@bldr/lamp/masters~MasterIcon}
     */
    this.icon = null

    /**
     * A style configuration object.
     *
     * @type {module:@bldr/lamp~styleConfig}
     */
    this.styleConfig = null

    /**
     * Some markdown formated string to document this master slide.
     *
     * @type {String}
     */
    this.documentation = null

    /**
     * A vuex object containing `state`, `getters`, `actions`, `mutations`
     * properties which buildes a submodule vuex store for each master.
     *
     * @type {Object}
     */
    this.store = null

    /**
     * The definition of the slide properties (`props`) (aka `props` of a
     * `master`).
     *
     * @type {module:@bldr/lamp~propsDef}
     */
    this.propsDef = null

    /**
     * All imported methods. They are not called directly, but through
     * public methods, which adds additional functionality.
     *
     * @private
     * @type {Object}
     */
    this.hooks_ = {}
    for (const spec in specs) {
      if (spec === 'icon') {
        this.icon = new MasterIcon(specs.icon)
      } else if (spec === 'props') {
        // To avoid confusion between real world prop with real world values
        // and props defintions we choose a different name.
        this.propsDef = specs.props
      } else if (spec === 'hooks') {
        // Make hooks private. Hooks should called from the public wrapper
        // methods.
        this.hooks_ = specs[spec]
      } else {
        this[spec] = specs[spec]
      }
    }
    this.registerVuexModule_()
  }

  /**
   * Generate the name of the Vuex module, e. g. `lampMasterCamera`.
   *
   * @returns {String}
   * @private
   */
  vueModuleName_ () {
    return `lampMaster${toTitleCase(this.name)}`
  }

  /**
   * Shortcut function to access the masters Vuex module getter function.
   *
   * @param {String} getterName
   * @param {Mixed} arg
   */
  $get (getterName, arg) {
    getterName = this.vueModuleName_() + '/' + getterName
    if (arg) {
      return store.getters[getterName](arg)
    } else {
      return store.getters[getterName]
    }
  }

  /**
   * Shortcut function to access the masters Vuex module commit function.
   *
   * @param {String} mutationName
   * @param {Mixed} payload
   */
  $commit (mutationName, payload) {
    mutationName = this.vueModuleName_() + '/' + mutationName
    store.commit(mutationName, payload)
  }

  /**
   * A example presentation file in the raw YAML format (unparsed). The string
   * is structured like the contents of the `*.baldr.yml` files.
   *
   * @type {String}
   */
  get example () {
    const rawYaml = rawYamlExamples.masters[this.name]
    const prefix =
      '---\n' +
      'meta:\n' +
      `  id: EP_master_${this.name}\n` +
      `  title: Beispiel-Präsentation für die Master-Folie „${this.name}“\n` +
      '\n'
    return rawYaml.replace('---\n', prefix)
  }

  /**
   * Must called after `this.store` is set.
   *
   * @private
   */
  registerVuexModule_ () {
    if (this.store) {
      this.store.namespaced = true
      store.registerModule(this.vueModuleName_(), this.store)
    }
  }

  /**
   * A cleaned version of `this.example`.
   *
   * Remove the empty line at the beginning of the backtick string example.
   *
   * @returns {String}
   */
  get exampleClean () {
    if (this.example) {
      return this.example.replace(/^\n*/, '')
    }
  }

  /**
   * Call a master hook. Master hooks are definied in the `main.js`
   * files.
   *
   * @param {String} hookName - The name of the master hook / function.
   * @param {mixed} payload - The argument the master hook / function is called
   *   with.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {mixed}
   *
   * @private
   */
  callHook_ (hookName, payload, thisArg) {
    if (this.hooks_[hookName] && typeof this.hooks_[hookName] === 'function') {
      if (thisArg) {
        return this.hooks_[hookName].call(thisArg, payload)
      }
      return this.hooks_[hookName](payload)
    }
  }

  /**
   * Asynchronous version. Call a master hook. Master hooks are definied in the
   * `main.js` files.
   *
   * @param {String} hookName - The name of the master hook / function.
   * @param {mixed} payload - The argument the master hook / function is called
   *   with.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {mixed}
   *
   * @private
   */
  async callHookAsync_ (hookName, payload, thisArg) {
    if (this.hooks_[hookName] && typeof this.hooks_[hookName] === 'function') {
      if (thisArg) {
        return await this.hooks_[hookName].call(thisArg, payload)
      }
      return await this.hooks_[hookName](payload)
    }
  }

  /**
   * result must fit to props
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {object}
   */
  normalizeProps (props) {
    return this.callHook_('normalizeProps', props)
  }

  /**
   * Calculate from the given props the step count. This hook method is called
   * after media resolution.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @param {Object} payload
   * @property {Object} payload.props - The props of the master slide.
   * @property {Object} payload.propsMain - The props of the main Vue component.
   * @property {Object} payload.propsPreview - The props of the preview Vue component.
   * @property {Object} payload.slide - The slide object.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Number} - The number of steps.
   */
  calculateStepCount (payload, thisArg) {
    return this.callHook_('calculateStepCount', payload, thisArg)
  }

  /**
   * The name of the props which are supporting inline media (for example
   * `markup`)
   */
  get propNamesInlineMedia () {
    const inlineMarkupProps = []
    for (const propName in this.propsDef) {
      const propDef = this.propsDef[propName]
      if (propDef.inlineMarkup) {
        inlineMarkupProps.push(propName)
      }
    }
    return inlineMarkupProps
  }

  /**
   * Filter the master props for props which are supporting inline media.
   *
   * @param {module:@bldr/lamp~props}
   *
   * @returns {Set}
   */
  extractInlineMediaUris (props) {
    const uris = new Set()
    /**
     * @param {String} text
     */
    function extractUrisInText (text) {
      const matches = text.matchAll(new RegExp(inlineMarkup.regExp, 'g'))
      for (const match of matches) {
        //  12    3            4
        // [((id):(Fuer-Elise))( caption="Für Elise")]
        if (match[2] === 'id') uris.add(match[1])
      }
    }

    for (const propName of this.propNamesInlineMedia) {
      const prop = props[propName]
      if (prop) {
        if (typeof prop === 'string') {
          extractUrisInText(prop)
        // `markup` in `generic` is an array.
        } else if (Array.isArray(prop)) {
          for (const item of prop) {
            extractUrisInText(item)
          }
        }
      }
    }
    return uris
  }

  /**
   * Replace the inline media tags `[id:Beethoven]` in certain props with
   * HTML. This function must be called after the media resolution.
   *
   * @param {module:@bldr/lamp~props}
   */
  renderInlineMedia (props) {
    /**
     * @param {String} text
     */
    function renderOneMediaUri (text) {
      return text.replace(new RegExp(inlineMarkup.regExp, 'g'), function (match) {
        const item = new inlineMarkup.Item(match)
        return inlineMarkup.render(item)
      })
    }

    for (const propName of this.propNamesInlineMedia) {
      const prop = props[propName]
      if (prop) {
        if (typeof prop === 'string') {
          props[propName] = renderOneMediaUri(prop)
        // `markup` in `generic` is an array.
        } else if (Array.isArray(prop)) {
          for (let i = 0; i < prop.length; i++) {
            props[propName][i] = renderOneMediaUri(prop[i])
          }
        }
      }
    }
  }

  /**
   * Retrieve the media URIs which have to be resolved.
   *
   * Call the master funtion `resolveMediaUris` and collect the media URIs.
   * (like [id:beethoven, id:mozart]). Extract media URIs from
   * the text props.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {Set}
   */
  resolveMediaUris (props) {
    let uris = this.callHook_('resolveMediaUris', props)

    // To allow undefined return values of the hooks.
    if (!uris) {
      uris = new Set()
    } else if (typeof uris === 'string') {
      uris = new Set([uris])
    }

    const inlineUris = this.extractInlineMediaUris(props)
    for (const uri of inlineUris) {
      uris.add(uri)
    }
    if (uris.size) return uris
  }

  /**
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {String}
   */
  plainTextFromProps (props) {
    return this.callHook_('plainTextFromProps', props)
  }

  /**
   * Called when entering a slide.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/lamp/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/lamp~props} payload.oldProps
   * @property {module:@bldr/lamp/content-file~Slide} payload.newSlide
   * @property {module:@bldr/lamp~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  enterSlide (payload, thisArg) {
    this.callHook_('enterSlide', payload, thisArg)
  }

  /**
   * Called before leaving a slide. This hook is triggered before the new
   * slide number `slideNo` is set in the vuex store.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/lamp/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/lamp~props} payload.oldProps
   * @property {module:@bldr/lamp/content-file~Slide} payload.newSlide
   * @property {module:@bldr/lamp~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  beforeLeaveSlide (payload, thisArg) {
    this.callHook_('beforeLeaveSlide', payload, thisArg)
  }

  /**
   * Called when leaving a slide. This hook is triggered by the Vue lifecycle
   * hook `beforeDestroy`.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {module:@bldr/lamp/content-file~Slide} payload.oldSlide
   * @property {module:@bldr/lamp~props} payload.oldProps
   * @property {module:@bldr/lamp/content-file~Slide} payload.newSlide
   * @property {module:@bldr/lamp~props} payload.newProps
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  leaveSlide (payload, thisArg) {
    this.callHook_('leaveSlide', payload, thisArg)
  }

  /**
   * Called when entering a step.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {number} payload.oldStepNo
   * @property {number} payload.newStepNo
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  enterStep (payload, thisArg) {
    return this.callHook_('enterStep', payload, thisArg)
  }

  /**
   * Called when leaving a step.
   *
   * @param {object} payload
   * @property {object} payload
   * @property {number} payload.oldStepNo
   * @property {number} payload.newStepNo
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   */
  leaveStep (payload, thisArg) {
    return this.callHook_('leaveStep', payload, thisArg)
  }

  /**
   * Convert in the props certain strings containing markup to HTML.
   *
   * @param {module:@bldr/lamp~props} props
   *
   * @returns {object}
   */
  markupToHtml (props) {
    if (!this.propsDef) return props
    for (const propName in props) {
      const prop = this.propsDef[propName]
      if ('markup' in prop && prop.markup) {
        props[propName] = markupToHtml(props[propName])
      }
    }
    return props
  }

  /**
   * Raise an error if there is an unkown prop - a not in the `props` section
   * defined prop.
   *
   * @param {module:@bldr/lamp~props} props
   */
  detectUnkownProps (props) {
    for (const propName in props) {
      if (this.propsDef && !(propName in this.propsDef)) {
        throw new Error(`The master slide “${this.name}” has no property named “${propName}”.`)
      }
    }
  }

  /**
   * Validate all media file URIs in the props of a certain slide.
   *
   * @param {module:@bldr/lamp~props} props
   */
  validateUris (props) {
    if (!this.propsDef) return props
    for (const propName in props) {
      const prop = this.propsDef[propName]
      if ('mediaFileUri' in prop && prop.mediaFileUri) {
        props[propName] = validateUri(props[propName])
      }
    }
    return props
  }

  /**
   * Collect the props (properties) for the main Vue component.
   *
   * @param {object} props - The props of the master slide.
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Object} - The props for the main component as a object.
   */
  collectPropsMain (props, thisArg) {
    const propsMain = this.callHook_('collectPropsMain', props, thisArg)
    if (propsMain) return propsMain
    if (props) return props
  }

  /**
   * Collect the props (properties) for the preview Vue component.
   *
   * @param {Object} payload
   * @property {Object} payload.props - The props of the master slide.
   * @property {Object} payload.propsMain - The props of the main Vue component.
   *
   * @param {object} thisArg - The
   *   {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call thisArg}
   *   the master function is called with.
   *
   * @returns {Object} - The props for the preview component as a object.
   */
  collectPropsPreview (payload, thisArg) {
    const propsPreview = this.callHook_('collectPropsPreview', payload, thisArg)
    if (propsPreview) return propsPreview
    if (payload.propsMain) return payload.propsMain
    if (payload.props) return payload.props
  }

  /**
   * Hook after loading. To load resources in the background.
   *
   * @param {Object} props - The properties of the slide.
   * @param {Object} thisArg
   */
  afterLoading (props, thisArg) {
    this.callHook_('afterLoading', { props, master: this }, thisArg)
  }

  /**
   * This hook gets executed after the media resolution. Wait for this hook to
   * finish. Go not in the background.
   *
   * @param {Object} props - The properties of the slide.
   * @param {Object} thisArg
   */
  async afterMediaResolution (props, thisArg) {
    await this.callHookAsync_('afterMediaResolution', { props, master: this }, thisArg)
  }

  afterSlideNoChangeOnComponent (payload, thisArg) {
    this.callHook_('afterSlideNoChangeOnComponent', payload, thisArg)
  }

  afterStepNoChangeOnComponent (payload, thisArg) {
    this.callHook_('afterStepNoChangeOnComponent', payload, thisArg)
  }
}

/**
 * Container for all registered master slides.
 */
class Masters {
  constructor () {
    /**
     * A container object for all master objects.
     *
     * @type {Object}
     */
    this.masters_ = {}
  }

  /**
   * Add a master to the masters container.
   *
   * @param {module:@bldr/lamp/masters~Master} master
   */
  add (master) {
    this.masters_[master.name] = master
  }

  /**
   * Get a master object by the master name.
   *
   * @param {string} name - The name of the master slide.
   *
   * @returns {module:@bldr/lamp/masters~Master}
   */
  get (name) {
    if (!(name in this.masters_)) {
      throw new Error(`Class Masters.get(): No master named “${name}”`)
    }
    return this.masters_[name]
  }

  /**
   * Get all master objects as an object with the master name as properties.
   *
   * @returns {object}
   */
  get all () {
    return this.masters_
  }

  /**
   * Get all master names as an array.
   *
   * @returns {Array}
   */
  get allNames () {
    return Object.keys(this.masters_)
  }

  /**
   * Check if a master exist.
   *
   * @param {string} name - The name of the master slide.
   *
   * @returns {Boolean}
   */
  exists (name) {
    if (name in this.masters_) return true
    return false
  }
}

/**
 * This object is mixed in into each master component.
 */
const masterMixin = {
  props: {
    navNos: {
      type: Object
    }
  },
  watch: {
    navNos (newValue, oldValue) {
      this.$nextTick(() => {
        let slideNoChange = false
        if (newValue.slideNo !== oldValue.slideNo) {
          this.master.afterSlideNoChangeOnComponent({
            oldSlideNo: oldValue.slideNo,
            newSlideNo: newValue.slideNo
          }, this)
          slideNoChange = true
        }
        if (newValue.stepNo && newValue.stepNo !== oldValue.stepNo) {
          this.master.afterStepNoChangeOnComponent({
            oldStepNo: oldValue.stepNo,
            newStepNo: newValue.stepNo,
            slideNoChange
          }, this)
        }
      })
    }
  },
  mounted () {
    this.master.afterSlideNoChangeOnComponent({
      newSlideNo: this.navNos.slideNo
    }, this)
    if (this.navNos.stepNo) {
      this.master.afterStepNoChangeOnComponent({
        newStepNo: this.navNos.stepNo,
        slideNoChange: true
      }, this)
    }

    const oldSlide = vue.$store.getters['lamp/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.props
    }
    // On instant slides like camera or editor there is no newSlide
    const newSlide = vue.$store.getters['lamp/slide']
    let newProps
    if (newSlide) {
      newProps = newSlide.props
      newSlide.master.enterSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    }
    customStore.vueMasterInstanceCurrent = this
    inlineMarkup.makeReactive()
  },
  beforeDestroy () {
    const oldSlide = vue.$store.getters['lamp/slideOld']
    let oldProps
    if (oldSlide) {
      oldProps = oldSlide.props
    }
    // On instant slides like camera or editor there is no newSlide
    const newSlide = vue.$store.getters['lamp/slide']
    if (newSlide) {
      const newProps = newSlide.props
      newSlide.master.leaveSlide({ oldSlide, oldProps, newSlide, newProps }, this)
    }
    customStore.vueMasterInstanceCurrent = null
  }
}

/**
 * Register all masters. Search for `main.js`, `main.vue` and `preview.vue`
 * files in the subfolder `masters`.
 *
 * @see {@link https://github.com/chrisvfritz/vue-enterprise-boilerplate/blob/master/src/components/_globals.js}
 * @see {@link https://webpack.js.org/guides/dependency-management/#require-context}
 *
 * @returns {module:@bldr/lamp/masters~Masters}
 */
function registerMasters () {
  function findMasterName (fileName) {
    const match = fileName.match(/\.\/([\w]+)\/.*/)
    if (!match) {
      throw new Error(`The master name couldn’t be retrieved from ${fileName}”`)
    }
    return match[1]
  }

  function checkExport (fileName, requiredObject) {
    if (!requiredObject) {
      throw new Error(`“${fileName}” couldn’t be imported.`)
    }
    if (!requiredObject.default) {
      throw new Error(`“${fileName}” must export a default object.`)
    }
  }

  const masters = new Masters()
  const requireMaster = require.context('./masters', true, /.+main\.js$/)
  requireMaster.keys().forEach((fileName) => {
    // ./masterName/main.js
    const masterName = findMasterName(fileName)
    const masterObj = requireMaster(fileName)
    const masterSpec = masterObj.default
    masterSpec.name = masterName
    checkExport(fileName, masterObj)
    const master = new Master(masterSpec)
    masters.add(master)
  })

  const requireComponentMain = require.context('./masters', true, /.+main\.vue$/)
  requireComponentMain.keys().forEach((fileName) => {
    // ./masterName/main.vue
    const masterName = findMasterName(fileName)
    const master = masters.get(masterName)
    const componentMain = requireComponentMain(fileName)
    const dataMixin = {
      data () {
        return {
          masterName,
          master // I tried '$master' with no success. Maybe $ Dollar prefixed properties are not allowed?
        }
      }
    }
    componentMain.default.mixins = [masterMixin, dataMixin]
    checkExport(fileName, componentMain)
    master.componentMain = componentMain.default
  })

  const requireComponentPreview = require.context('./masters', true, /.+preview\.vue$/)
  requireComponentPreview.keys().forEach((fileName) => {
    // ./masterName/preview.vue
    const masterName = findMasterName(fileName)
    const master = masters.get(masterName)
    const componentPreview = requireComponentPreview(fileName)
    checkExport(fileName, componentPreview)
    master.componentPreview = componentPreview.default
  })
  return masters
}

/**
 * An instance of the class `Masters()`
 *
 * @type {module:@bldr/lamp/masters~Master}
 */
export const masters = registerMasters()

/**
 * This object is mixed in into each preview master vue component.
 */
const componentPreviewMixin = {
  components: {
    SlidePreviewPlayButton
  }
}

/**
 * Register all masters as Vue components.
 */
export function registerMasterComponents () {
  for (const masterName in masters.all) {
    const master = masters.get(masterName)
    if (master.componentMain) {
      Vue.component(`${masterName}-master-main`, master.componentMain)
    }
    if (master.componentPreview) {
      master.componentPreview.mixins = [componentPreviewMixin]
      Vue.component(`${masterName}-master-preview`, master.componentPreview)
    }
  }
}
