/**
 * @param {Object} vuex - see Vuex documentation
 * @param {Number} direction - `1`: next, `-1`: previous
 */
setStepNextOrPrevious ({ dispatch, getters }, direction) {
  const slide = getters.slide
  if (!slide) return
  const count = slide.stepCount
  if (!count) return
  let stepNo
  const no = slide.stepNo
  // Next
  if (direction === 1 && no === count) {
    stepNo = 1
  // Previous
  } else if (direction === -1 && no === 1) {
    stepNo = count
  } else {
    stepNo = no + direction
  }
  dispatch('setStepNoCurrent', { slide, stepNo })
}

/**
 * If the direction is next (1) set the step number to 1. If the direction
 * is previous (-1), set the step number to the last step = step count.
 *
 * @param {Object} vuex - see Vuex documentation
 * @param {Number} direction - `1`: next, `-1`: previous
 */
function setStepLastOrFirstByDirection ({ dispatch, getters }, direction) {
  // We need a new current slide.
  // Only set the step number on slides with step support. The master slide
  // cloze sets the variable stepCount async. If you enter a never before
  // visited cloze slide backwards, strange things happens.
  if (getters.slide.stepCount) {
    let stepNo = 1
    if (direction === -1) {
      stepNo = getters.slide.stepCount
    }
    dispatch('setStepNoCurrent', {
      slide: getters.slide,
      stepNo
    })
  }
}

/**
 * @param {Object} vuex - see Vuex documentation
 * @param {Number} direction - `1`: next, `-1`: previous
 */
function setSlideNextOrPrevious ({ dispatch, getters }, direction) {
  const no = getters.slideNo
  const count = getters.slidesCount
  // next
  if (direction === 1 && no === count) {
    dispatch('setSlideNoCurrent', 1)
  // previous
  } else if (direction === -1 && no === 1) {
    dispatch('setSlideNoCurrent', count)
  } else {
    dispatch('setSlideNoCurrent', no + direction)
  }
}

/**
 * Know issues. previous to a not yet visited note master with steps: the
 * first step is shown instead of the last.
 *
 * @param {Object} vuex - see Vuex documentation
 * @param {Number} direction - `1`: next, `-1`: previous
 */
function setSlideOrStepNextOrPrevious ({ dispatch, getters }, direction) {
  // Change only steps
  if (
    getters.slide.stepCount > 1 &&
    (
      (direction === 1 && getters.slide.stepNo !== getters.slide.stepCount) || // Next
      (direction === -1 && getters.slide.stepNo !== 1) // Previous
    )
  ) {
    dispatch('setStepNextOrPrevious', direction)
  // Change slide and steps
  } else {
    dispatch('setSlideNextOrPrevious', direction)
    dispatch('setStepLastOrFirstByDirection', direction)
  }
}
