/**
 * @file Entry file of the render process. Assemble all classes
 * @module baldr/render
 */

'use strict'

const mousetrap = require('mousetrap')
const { remote } = require('electron')
const { ShowRunner } = require('@bldr/core')

/* jshint -W117 */

/**
 * Toogle the modal window
 */
const toggleModal = function () {
  const modal = document.getElementById('modal')
  const state = modal.style.display
  if (state === 'none') {
    modal.style.display = 'block'
    return 'block'
  } else if (state === 'block') {
    modal.style.display = 'none'
    return 'none'
  } else {
    return false
  }
}

/**
 *
 */
const bindFunction = function (binding) {
  if (binding.keys) {
    for (const key of binding.keys) {
      mousetrap.bind(key, binding.function)
    }
  }

  if (binding.IDs) {
    for (const ID of binding.IDs) {
      document
        .getElementById(ID)
        .addEventListener('click', binding.function)
    }
  }
}

/**
 *
 */
const bindFunctions = function (bindings) {
  for (const binding of bindings) {
    bindFunction(binding)
  }
}

/**
 *
 */
const errorPage = function (message, source, lineNo, colNo, error) {
  document.getElementById('slide-content').innerHTML = `
  <p>${message}</p>
  <p>Source: ${source}</p>
  <p>Line number: ${lineNo}</p>
  <p>Column number: ${colNo}</p>
  <pre>${error.stack}</pre>
  `
}

/***********************************************************************
 *
 **********************************************************************/

/**
 * Initialize the presentaton session.
 */
const main = function () {
  window.onerror = errorPage
  const show = new ShowRunner(remote.process.argv, document, mousetrap)

  bindFunctions(
    [
      {
        function: () => { show.stepPrev() },
        keys: ['up'],
        IDs: ['nav-step-prev']
      },
      {
        function: () => { show.stepNext() },
        keys: ['down'],
        IDs: ['nav-step-next']
      },
      {
        function: () => { show.slidePrev() },
        keys: ['left'],
        IDs: ['nav-slide-prev']
      },
      {
        function: () => { show.slideNext() },
        keys: ['right'],
        IDs: ['nav-slide-next']
      },
      {
        function: toggleModal,
        keys: ['esc'],
        IDs: ['modal-open', 'modal-close']
      }
    ]
  )
}

/***********************************************************************
 *
 **********************************************************************/

if (require.main === module) {
  main()
}
