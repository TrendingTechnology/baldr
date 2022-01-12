/**
 * Wrapper functions around {@link https://craig.is/killing/mice mousetrap}.
 *
 * A instance of the class
 * {@link module:@bldr/shortcuts~Shortcuts Shortcuts} is mounted
 * under `this.$shortcuts` in the Vue apps.
 *
 * @module @bldr/shortcuts
 */

import Vue from 'vue'

import VueRouter, { Route, RouteConfig } from 'vue-router'
import { Store } from 'vuex'

import { Mousetrap } from '@bldr/mousetrap-wrapper'

import ShortcutsOverview from './ShortcutsOverview.vue'

interface ShortcutGroup {
  name: string
  displayName: string
}

interface ShortcutSpec {
  /**
   * Mousetrap key specification, see the
   * {@link https://craig.is/killing/mice documentation}.
   */
  keys: string

  /**
   * A callback function.
   */
  callback: () => void

  /**
   * Some text to describe the shortcut.
   */
  description: string

  /**
   * A list of route names.
   * Activate this shortcut only on this routes.
   */
  routeNames?: string[]

  /**
   * Keyboard shortcuts that belong together can be identified by this string.
   * Should be identical with `ShortcutGroup.name`
   */
  group?: string
}

interface ShortcutCollection {
  [keys: string]: ShortcutSpec
}

type State = Record<string, ShortcutSpec>

const state: State = {}

const getters = {
  all: (state: State) => {
    return state
  }
}

const cache: ShortcutCollection = {}

const mutations = {
  add (state: State, shortcut: ShortcutSpec) {
    // if (state[shortcut.keys] != null) {
    //   throw new Error(`Keyboard shortcut “${shortcut.keys}” “${shortcut.description}” already taken.`)
    // }
    Vue.set(state, shortcut.keys, shortcut)
  },
  remove (state: State, keys: string) {
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
export class ShortcutManager {
  constructor () {
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

  /**
   * Add a shortcut.
   *
   * @param keys - Mousetrap key specification, see the
   *   {@link https://craig.is/killing/mice documentation}.
   * @param callback - A callback function.
   * @param description - Some text to describe the shortcut.
   * @param routeNames - A list of route names. Activate this
   *   shortcut only on this routes.
   */
  add (
    keys: string,
    callback: () => void,
    description: string,
    routeNames?: string[],
    group?: string
  ) {
    const prevent = () => {
      if (routeNames != null) {
        if (
          router.currentRoute.name != null &&
          routeNames.includes(router.currentRoute.name)
        ) {
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
    if (store) {
      store.commit('shortcuts/add', { keys, description })
    }
    cache[keys] = { keys, callback, description, routeNames, group }
  }

  addNg (specs: ShortcutSpec | ShortcutSpec[]) {
    if (!Array.isArray(specs)) {
      specs = [specs]
    }
    for (const spec of specs) {
      this.add(
        spec.keys,
        spec.callback,
        spec.description,
        spec.routeNames,
        spec.group
      )
    }
  }

  /**
   * A multiple shortcuts
   */
  addMultiple (shortcutSpecs: ShortcutSpec[]) {
    for (const shortcut of shortcutSpecs) {
      this.add(
        shortcut.keys,
        shortcut.callback,
        shortcut.description,
        shortcut.routeNames,
        shortcut.group
      )
    }
  }

  /**
   * Remove a shortcut.
   *
   * @param keys - Mousetrap key specification, see the
   *   {@link https://craig.is/killing/mice documentation}.
   */
  remove (keys: string): void {
    Mousetrap.unbind(keys)
    delete cache[keys]
    if (store != null) {
      store.commit('shortcuts/remove', keys)
    }
  }

  removeByGroup (group: string): void {
    for (const keys in cache) {
      const spec = cache[keys]
      if (spec.group === group) {
        this.remove(spec.keys)
      }
    }
  }

  /**
   * Remove multiple shortcuts at once.
   *
   * @param keysList - An array of Mousetrap key specification.
   */
  removeMultiple (keysList: string[]): void {
    for (const keys of keysList) {
      this.remove(keys)
    }
  }

  addRoute (route: RouteConfig): void {
    router.addRoutes([route])
    const router_ = router as any
    router_.options.routes.push(route)
  }

  fromRoute (route: RouteConfig) {
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
          if (router.currentRoute.path !== route.path) {
            router.push(route)
          }
        },
        // `Go to route: ${routeTitle}`
        `Gehe zu: „${routeTitle}“`
      )
    }
  }

  fromRoutes () {
    const router_ = router as any
    for (const route of router_.options.routes) {
      this.fromRoute(route)
    }
  }

  pause () {
    Mousetrap.pause()
  }

  unpause () {
    Mousetrap.unpause()
  }
}

export let shortcutManager: ShortcutManager

let router: VueRouter
let store: Store<any> | null

interface Options {
  router: VueRouter
  store?: Store<any>
}

// https://stackoverflow.com/a/56501461
// Vue.use(shortcuts, router, store)
const Plugin = {
  install (V: typeof Vue, options: Options) {
    if (options.router == null) {
      throw new Error('Pass in an instance of “VueRouter”.')
    }

    router = options.router

    if (options.store != null) {
      store = options.store
      store.registerModule('shortcuts', storeModule)
    }

    shortcutManager = new ShortcutManager()
    V.prototype.$shortcuts = shortcutManager
  }
}

export default Plugin
