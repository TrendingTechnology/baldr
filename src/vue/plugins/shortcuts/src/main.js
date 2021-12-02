/**
 * Wrapper functions around {@link https://craig.is/killing/mice mousetrap}.
 *
 * A instance of the class
 * {@link module:@bldr/shortcuts~Shortcuts Shortcuts} is mounted
 * under `this.$shortcuts` in the Vue apps.
 *
 * @module @bldr/shortcuts
 */

import { Mousetrap } from '@bldr/mousetrap-wrapper'
import Vue from 'vue'
import ShortcutsOverview from './ShortcutsOverview.vue'

/**
 * @typedef {Object} shortcutSpec
 * @property {String} shortcutSpec.keys - Mousetrap key specification, see the
 *   {@link https://craig.is/killing/mice documentation}.
 * @property {Function} shortcutSpec.callback - A callback function.
 * @property {String} shortcutSpec.description - Some text to describe the
 *   shortcut.
 * @property {Array} shortcutSpec.routeNames - A list of route names.
 *   Activate this shortcut only on this routes.
 */

const state = {}

const getters = {
  all: (state) => {
    return state
  }
}

const mutations = {
  add (state, shortcut) {
    // if (state[shortcut.keys] != null) {
    //   throw new Error(`Keyboard shortcut “${shortcut.keys}” “${shortcut.description}” already taken.`)
    // }
    Vue.set(state, shortcut.keys, shortcut)
  },
  remove (state, keys) {
    Vue.delete(state, keys)
  }
}

const storeModule = {
  namespaced: true,
  state,
  getters,
  mutations
}

/**
 * This class is mounted under `this.$shortcuts`
 */
class Shortcuts {
  constructor (router, store) {
    /**
     * A {@link https://router.vuejs.org/ vue router instance.}
     *
     * @type {Object}
     */
    this.$router = router

    /**
     * A {@link https://vuex.vuejs.org/ vuex store instance.}
     *
     * @type {Object}
     */
    this.$store = store

    if (this.$router) {
      const route = {
        path: '/shortcuts',
        meta: {
          shortcut: 'ctrl+h'
        },
        // shortcuts
        name: 'Tastenkürzel',
        component: ShortcutsOverview
      }
      this.addRoute(route)
      this.fromRoutes()
    }
  }

  /**
   * Add a shortcut.
   *
   * @param {String} keys - Mousetrap key specification, see the
   *   {@link https://craig.is/killing/mice documentation}.
   * @param {Function} callback - A callback function.
   * @param {String} description - Some text to describe the shortcut.
   * @param {Array} routeNames - A list of route names. Activate this
   *   shortcut only on this routes.
   */
  add (keys, callback, description, routeNames) {
    const prevent = () => {
      if (routeNames) {
        if (routeNames.includes(this.$router.currentRoute.name)) {
          callback()
        }
      } else {
        callback()
      }

      // Prevent default
      // As a convenience you can also return false in your callback:
      return false
    }
    Mousetrap.bind(keys, prevent)
    if (this.$store) this.$store.commit('shortcuts/add', { keys, description })
  }

  /**
   * A multiple shortcuts
   *
   * @param {array} shortcutSpecs - An array of
   *   {@link module:@bldr/shortcuts~shortcutSpec shortcutSpec}.
   */
  addMultiple (shortcutSpecs) {
    for (const shortcut of shortcutSpecs) {
      this.add(
        shortcut.keys,
        shortcut.callback,
        shortcut.description,
        shortcut.routeNames
      )
    }
  }

  /**
   * Remove a shortcut.
   *
   * @param {String} keys - Mousetrap key specification, see the
   *   {@link https://craig.is/killing/mice documentation}.
   */
  remove (keys) {
    Mousetrap.unbind(keys)
    if (this.$store) this.$store.commit('shortcuts/remove', keys)
  }

  /**
   * Remove multiple shortcuts at once.
   *
   * @param {Array} keysList - An array of Mousetrap key specification.
   */
  removeMultiple (keysList) {
    for (const keys of keysList) {
      this.remove(keys)
    }
  }

  /**
   *
   * @param {Object} route
   */
  addRoute (route) {
    this.$router.addRoutes([route])
    this.$router.options.routes.push(route)
  }

  /**
   * @param {Object} route
   */
  fromRoute (route) {
    if ('meta' in route && 'shortcut' in route.meta) {
      let routeTitle
      if ('title' in route.meta) {
        routeTitle = route.meta.title
      } else if ('name' in route) {
        routeTitle = route.name
      } else {
        routeTitle = route.path
      }
      let key
      if (route.meta.shortcut.length === 1) {
        key = `g ${route.meta.shortcut}`
      } else {
        key = route.meta.shortcut
      }
      this.add(
        key,
        () => {
          // To avoid uncaught exception object when navigation to a already
          // loaded route.
          if (this.$router.currentRoute.path !== route.path) {
            this.$router.push(route)
          }
        },
        // `Go to route: ${routeTitle}`
        `Gehe zu: „${routeTitle}“`
      )
    }
  }

  /**
   * @param {object} router - The router object of the Vue router (this.$router)
   */
  fromRoutes () {
    for (const route of this.$router.options.routes) {
      this.fromRoute(route)
    }
  }

  /**
   *
   */
  pause () {
    Mousetrap.pause()
  }

  /**
   *
   */
  unpause () {
    Mousetrap.unpause()
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(shortcuts, router, store)
const Plugin = {
  install (Vue, router, store) {
    if (!router) throw new Error('Pass in an instance of “VueRouter”.')
    if (store) store.registerModule('shortcuts', storeModule)
    /**
     * $shortcuts
     * @memberof module:@bldr/lamp~Vue
     * @type {module:@bldr/shortcuts~Shortcuts}
     */
    Vue.prototype.$shortcuts = new Shortcuts(router, store)
  }
}

export default Plugin
