/**
 * @file Wrapper functions around mousetrap
 */

import Mousetrap from 'mousetrap'
import store from '@/store.js'

function add (keys, callback, description) {
  const prevent = () => {
    callback()
    // As a convenience you can also return false in your callback:
    return false
  }
  Mousetrap.bind(keys, prevent)
  store.commit('addShortcut', { keys, description })
}

/**
 * @param {array} shortcuts
 */
function addMultiple (shortcuts) {
  for (const shortcut of shortcuts) {
    add(shortcut.keys, shortcut.callback, shortcut.description)
  }
}

function remove (keys) {
  Mousetrap.unbind(keys)
  store.commit('removeShortcut', keys)
}

export default {
  add,
  addMultiple,
  remove
}
