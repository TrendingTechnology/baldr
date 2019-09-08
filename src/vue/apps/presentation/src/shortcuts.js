import Mousetrap from 'mousetrap'
import store from '@/store.js'

export function bindShortcut (keys, callback, description) {
  Mousetrap.bind(keys, callback)
  store.commit('addShortcut', { keys, description })
}
