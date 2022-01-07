/**
 * Navigation module
 *
 * Navigate through all slides and steps of an presentation. Slide numbers can
 * be labeled with an ID. To simplfy the navigation through all slides and
 * steps, we build a list of all slide and steps
 *
 * @bldr/lamp/store/nav
 */

const state = {
  /**
   * The current navigation list number. This number starts with 1.
   */
  navListNo: 1,
  /**
   * ```json
   * [
   *   { "slideNo": 1 },
   *   { "slideNo": "two" },
   *   { "slideNo": 3 },
   *   { "slideNo": 4, "stepNo": 1 },
   *   { "slideNo": 4, "stepNo": 2 },
   *   { "slideNo": 4, "stepNo": 3 },
   *   { "slideNo": 5 }
   * ]
   * ```
   *
   * @type {Array}
   */
  navList: [],
  /**
   * Each slide can be labeled with an ID. Resolve this ID to get the slide
   * number. Store all slide IDs in the instantiated objects.
   *
   * ```json
   * {
   *   "one": 1,
   *   "two": 2
   * }
   * ```
   *
   * @type {Object}
   */
  slideIds: {},
  /**
   * ```json
   * {
   *   "slide/1": 1,
   *   "slide/two": 2,
   *   "slide/16/step/1": 16,
   *   "slide/16/step/2": 17
   * }
   * ```
   *
   * @tpye {Object}
   */
  navListIndex: {},
  fullStepUpdate: false,
  lastRoute: null
}

const getters = {
  fullStepUpdate: state => {
    return state.fullStepUpdate
  },
  /**
   *
   * @param {Object} params
   * @property {(String|Number)} slideNo - The slide number or the slide ID.
   * @property {Number} stepNo - The step number (can be unset).
   *
   * @private
   */
  indexByRouterParams: state => params => {
    if (params.stepNo) {
      return `slide/${params.slideNo}/step/${params.stepNo}`
    } else {
      return `slide/${params.slideNo}`
    }
  },
  lastRoute: state => {
    return state.lastRoute
  },
  navList: state => {
    return state.navList
  },
  navListCount: state => {
    return state.navList.length
  },
  navListIndex: state => {
    return state.navListIndex
  },
  navListNo: state => {
    return state.navListNo
  },
  /**
   *
   * @param {Object} params
   * @property {(String|Number)} slideNo - The slide number or the slide ID.
   * @property {Number} stepNo - The step number (can be unset).
   *
   * @returns {Number}
   */
  navListNoByRoute: (state, getters) => route => {
    const index = getters.indexByRouterParams(route.params)
    return state.navListIndex[index]
  },
  /**
   *
   * @param {Number} direction - `1`: next, `-1`: previous
   *
   * @returns {Number}
   */
  nextNavListNo: (state, getters) => direction => {
    const count = getters.navListCount
    const navListNo = getters.navListNo
    let no
    // Next
    if (direction === 1 && navListNo === count) {
      no = 1
    // Previous
    } else if (direction === -1 && navListNo === 1) {
      no = count
    } else {
      no = navListNo + direction
    }
    return no
  },
  /**
   * Get the router parameters for the next (or previous) slide.
   *
   * @param {Number} direction - `1`: next, `-1`: previous
   *
   * @returns {module:@bldr/lamp/content-file~routerParams}
   */
  nextRouterParams: (state, getters) => direction => {
    const no = getters.nextNavListNo(direction)
    return getters.routerParamsByNavListNo(no)
  },
  routerParamsByNavListNo: state => no => {
    return state.navList[no - 1]
  },
  slideIds: state => {
    return state.slideIds
  },
  slideNoById: (state) => slideId => {
    if (!state.slideIds[slideId]) {
      throw new Error(`Unkown slide ID “${slideId}”.`)
    }
    return state.slideIds[slideId]
  },
  /**
   * `slideNo` can be an ID. Replace this string IDs with the numeric slide
   * numbers for the Vuex store.
   *
   * @param {Object} params
   * @property {(String|Number)} slideNo - The slide number or the slide ID.
   * @property {Number} stepNo - The step number (can be unset).
   *
   * @returns {Object} paramsNormalized
   */
  slideStepNoByRoute: (state, getters) => route => {
    const paramsNormalized = Object.assign({}, route.params)
    if (state.slideIds[route.params.slideNo]) {
      paramsNormalized.slideNo = state.slideIds[route.params.slideNo]
    }
    return paramsNormalized
  }
}

const actions = {
  initNavList ({ commit, getters }, slides) {
    // After media resolution.
    for (const slide of slides) {
      let slideNo
      if (slide.id) {
        if (getters.slideIds[slide.id]) {
          throw new Error(`A slide with the id “${slide.id}” already exists.`)
        }
        commit('addSlideId', { slideId: slide.id, no: slide.no })
        slideNo = slide.id
      } else {
        slideNo = slide.no
      }
      // Generate the navigation list
      if (slide.stepCount && slide.stepCount > 1) {
        for (let index = 1; index <= slide.stepCount; index++) {
          const item = { slideNo, stepNo: index }
          commit('addNavListItem', item)
        }
      } else {
        const item = { slideNo }
        commit('addNavListItem', item)
      }
    }

    for (let i = 0; i < getters.navList.length; i++) {
      const params = getters.navList[i]
      const index = getters.indexByRouterParams(params)
      const navListNo = i + 1
      commit('addNavListIndex', { index, navListNo })
    }
  },
  /**
   * Set the current cav
   *
   * @param {Object} params -
   * @property {(String|Number)} slideNo - The slide number or the slide ID.
   * @property {Number} stepNo - The step number (can be unset).
   */
  setNavListNosByRoute ({ commit, getters, dispatch }, route) {
    const no = getters.navListNoByRoute(route)
    if (route.query.full && !getters.fullStepUpdate) {
      commit('setFullStepUpdate', true)
    } else if (!route.query.full && getters.fullStepUpdate) {
      commit('setFullStepUpdate', false)
    }
    commit('setNavListNo', no)
    const slideAndStepNos = getters.slideStepNoByRoute(route)
    dispatch('lamp/setSlideAndStepNoCurrent', slideAndStepNos, { root: true })
  }
}

const mutations = {
  addNavListItem (state, item) {
    state.navList.push(item)
  },
  addNavListIndex (state, { index, navListNo }) {
    state.navListIndex[index] = navListNo
  },
  addSlideId (state, { slideId, no }) {
    if (state.slideIds[slideId]) {
      throw new Error(`A slide with the id “${slideId}” already exists.`)
    }
    state.slideIds[slideId] = no
  },
  lastRoute (state, route) {
    state.lastRoute = route
  },
  setNavListNo (state, no) {
    state.navListNo = no
  },
  setFullStepUpdate (state, value) {
    state.fullStepUpdate = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
