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
    this.store_ = store
    this.router_ = router

    const route = {
      path: '/shortcuts',
      shortcut: 'ctrl+h',
      name: 'shortcuts',
      component: ShortcutsOverview
    }
    this.addRoute(route)
    this.fromRoutes()
  }

  add (keys, callback, description) {
    const prevent = () => {
      callback()
      // Prevent default
      // As a convenience you can also return false in your callback:
      return false
    }
    Mousetrap.bind(keys, prevent)
    this.store_.commit('addShortcut', { keys, description })
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
    this.store_.commit('removeShortcut', keys)
  }

  addRoute (route) {
    this.router_.addRoutes([route])
    this.router_.options.routes.push(route)
  }

  fromRoute (route) {
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
      let key
      if (route.shortcut.length == 1) {
        key = `g ${route.shortcut}`
      } else {
        key = route.shortcut
      }
      this.add(
        key,
        () => {
          this.router_.push(route.path)
        },
        `Go to route: ${routeTitle}`
      )
    }
  }

  /**
   * @param {object} router - The router object of the Vue router (this.$router)
   */
  fromRoutes () {
    for (const route of this.router_.options.routes) {
      this.fromRoute(route)
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
