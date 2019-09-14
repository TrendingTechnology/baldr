/**
 * @file Wrapper functions around mousetrap
 */

import Mousetrap from 'mousetrap'
import Vue from 'vue'
import ShortcutsOverview from './ShortcutsOverview.vue'

const state = {}

const getters = {
   shortcuts: (state) => {
    return state
  }
}

const mutations = {
  addShortcut (state, shortcut) {
    Vue.set(state, shortcut.keys, shortcut)
  },
  removeShortcut (state, keys) {
    Vue.delete(state, keys)
  }
}

const storeModule = {
  state,
  getters,
  mutations
}

class Shortcuts {
  constructor(store, router) {
    this.$store = store
    this.$router = router
    this.$router.addRoutes([{
      path: '/shortcuts',
      shortcut: 's',
      name: 'shortcuts',
      component: ShortcutsOverview
    }])
  }

  add (keys, callback, description) {
    const prevent = () => {
      callback()
      // Prevent default
      // As a convenience you can also return false in your callback:
      return false
    }
    Mousetrap.bind(keys, prevent)
    this.$store.commit('addShortcut', { keys, description })
  }

  /**
   * @param {array} shortcuts
   */
  addMultiple (shortcuts) {
    for (const shortcut of shortcuts) {
      this.add(shortcut.keys, shortcut.callback, shortcut.description)
    }
  }

  remove (keys) {
    Mousetrap.unbind(keys)
    this.$store.commit('removeShortcut', keys)
  }

  /**
   * @param {object} router - The router object of the Vue router (this.$router)
   */
  fromRoutes (router) {
    if (!router) router = this.$router
    for (const route of router.options.routes) {
      if ('shortcut' in route) {
        let routeTitle
        if ('meta' in route && 'title' in route.meta) {
          routeTitle = route.meta.title
        } else if ('title' in route) {
          routeTitle = route.title
        } else if ('name' in route) {
          routeTitle = route.name
        } else {
          routeTitle = route.path
        }
        this.add(
          `g ${route.shortcut}`,
          ( ) => { router.push(route.path) },
          `Go to route: ${routeTitle}`
        )
      }
    }
  }
}

// https://stackoverflow.com/a/56501461
// Vue.use(shortcuts, store, router)
const Plugin = {
  install (Vue, store, router) {
    store.registerModule('shortcuts', storeModule)
    Vue.prototype.$shortcuts = new Shortcuts(store, router)
  }
}

export default Plugin
