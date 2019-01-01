/**
 * @file Load the slides object form the YAML file format and process it.
 * @module @bldr/core/slides-switcher
 */

'use strict'

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class SlidesSwitcher {
  /**
   * @param {module:@bldr/core/slides~Slides} slides All slide
   *   objects of the current presentation session.
   * @param {module:@bldr/core~Environment} env Low level
   *   environment data.
   */
  constructor (slides, env) {
    /**
     * Low level environment data.
     * @type {module:@bldr/core~Environment}
     */
    this.env = env

    /**
     * All slides index by the slide number.
     * @type {module:@bldr/core/slides~Slides}
     */
    this.slides = slides

    /**
     * The count of all slides.
     * @type {int}
     */
    this.count = Object.keys(this.slides).length

    /**
     * The current slide number.
     * @type {int}
     */
    this.no = 1

    /**
     * @type {object}
     */
    this.elemNavigationButtons = {
      prev: this.env.document.getElementById('nav-slide-prev'),
      next: this.env.document.getElementById('nav-slide-next')
    }
  }

  /**
   *
   */
  setVisibility_ (state) {
    for (let prop in this.elemNavigationButtons) {
      this.elemNavigationButtons[prop].style.visibility = state
    }
  }

  /**
   *
   */
  setButtons_ () {
    if (this.count > 1) {
      this.setVisibility_('visible')
    } else {
      this.setVisibility_('hidden')
    }
  }

  /**
   * Set the current slide
   */
  getByNo (no) {
    this.setButtons_()
    return this.slides[no]
  }

  /**
   * Set the current slide to the previous slide.
   */
  prev () {
    if (this.no === 1) {
      this.no = this.count
    } else {
      this.no = this.no - 1
    }
    return this.getByNo(this.no)
  }

  /**
   * Set the current slide to the next slide.
   */
  next () {
    if (this.no === this.count) {
      this.no = 1
    } else {
      this.no = this.no + 1
    }
    return this.getByNo(this.no)
  }
}

exports.SlidesSwitcher = SlidesSwitcher
