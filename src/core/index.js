/**
 * @module @bldr/core
 */

'use strict'

// Node packages.
const path = require('path')

// Project packages.
const { getConfig } = require('@bldr/foundation-master')

/**
 * @param {string} fileName
 */
const requireLib = function (fileName) {
  return require(path.join(__dirname, fileName + '.js'))
}

const { getQuickStart } = requireLib('quick-start')
const { getMasters } = requireLib('masters')
const {
  getInstantSlide,
  getSlides
} = requireLib('slides')
const { SlidesSwitcher } = requireLib('slides-switcher')
const { getThemes } = requireLib('themes')

/***********************************************************************
 *
 **********************************************************************/

/**
 * The document object of the browser (DOM), see on MDN:
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Document Document}
 * @typedef Document
 * @type {object}
 */

/**
 * The object of shortcut library “mousetrap”.
 * {@link https://www.npmjs.com/package/mousetrap}
 * @typedef mousetrap
 * @type {object}
 */

/***********************************************************************
 *
 **********************************************************************/

/**
 * This class bundles important low level data in an object. The bundled
 * object can easily passed around through different classes and
 * avoids therefore many arguments in the constructor functions.
 *
 * @param {array} argv An array containing the command line arguments.
 * @param {module:@bldr/core~Document} document The document
 *   object (DOM) of the render process.
 */
class Environment {
  constructor (argv, document) {
    /**
     * The document object (DOM) of the render process.
     * @type {module:@bldr/core~Document}
     */
    this.document = document

    /**
     * All available master slides.
     * @type {module:@bldr/core/masters~Masters}
     */
    this.masters = getMasters(document)

    /**
     * All configurations of the current presentation session.
     * @type {module:@bldr/foundation-master/config~Config}
     */
    this.config = getConfig(argv)

    /**
     * All available themes.
     * @type {module:@bldr/core/themes~Themes}
     */
    this.themes = getThemes(document)
  }
}

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class ShowRunner {
  /**
   * @param {array} argv An array containing the command line arguments.
   * @param {module:@bldr/core~Document} document The document
   *   object (DOM) of the render process.
   * @param {module:@bldr/core~mousetrap} mousetrap The object
   *   of shortcut library “mousetrap”.
   */
  constructor (argv, document, mousetrap) {
    /**
     * Low level environment data.
     * @type {module:@bldr/core~Environment}
     */
    this.env = new Environment(argv, document)

    /**
     * The object of shortcut library “mousetrap”.
     * @type {module:@bldr/core~mousetrap}
     */
    this.mousetrap = mousetrap

    this.env.masters.execAll('init', this.env.document, this.env.config)

    /**
     * All slide objects of the current presentation session.
     * @type {module:@bldr/core/slides~Slides}
     */
    this.slides = getSlides(this.env)

    /**
     * Object to switch between the slides.
     * @type {module:@bldr/core/slides-switcher~SlidesSwitcher}
     */
    this.slidesSwitcher = new SlidesSwitcher(
      this.slides,
      this.env
    )

    /**
     * The object representation of the old slide.
     * @type {module:@bldr/core/slides~Slide}
     */
    this.oldSlide = {}

    /**
     * The object representation of the new slide.
     * @type {module:@bldr/core/slides~Slide}
     */
    this.newSlide = {}

    /**
     * Object to manage the quick start entries.
     * @type {module:@bldr/core/quick-start~QuickStart}
     */
    this.quickStart = getQuickStart(this.env)
    this.quickStart.set()
    this.quickStart.bind(this, this.mousetrap)

    this.setFirstSlide_()
  }

  /**
   *
   */
  setFirstSlide_ () {
    this.newSlide = this.slidesSwitcher.getByNo(1)
    this.newSlide.set()
  }

  /**
   *
   */
  setInstantSlide (masterName, rawData) {
    this.oldSlide = this.newSlide
    this.newSlide = getInstantSlide(
      masterName,
      rawData,
      this.env
    )
    this.newSlide.set(this.oldSlide)
  }

  /**
   *
   */
  stepPrev () {
    this.newSlide.steps.prev()
  }

  /**
   *
   */
  stepNext () {
    this.newSlide.steps.next()
  }

  /**
   *
   */
  slidePrev () {
    this.oldSlide = this.newSlide
    this.newSlide = this.slidesSwitcher.prev()
    this.newSlide.set(this.oldSlide)
  }

  /**
   *
   */
  slideNext () {
    this.oldSlide = this.newSlide
    this.newSlide = this.slidesSwitcher.next()
    this.newSlide.set(this.oldSlide)
  }
}

exports.Environment = Environment
exports.ShowRunner = ShowRunner
