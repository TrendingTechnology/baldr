/**
 * A Vuex store parent module for all masters.
 *
 * @see {@link module:@bldr/presentation/masters~Master#store The store property of the master object}
 *
 * @module @bldr/presentation/store/masters
 */

import { masters } from '@/masters.js'

const getters = {
  masterByName: state => masterName => {
    return masters.get(masterName)
  }
}

export default {
  namespaced: true,
  getters
}
