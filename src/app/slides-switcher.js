/**
 * @file Load the slides object form the YAML file format and process it.
 * @module baldr-application/slides-switcher
 */

'use strict';

/***********************************************************************
 *
 **********************************************************************/

/**
 *
 */
class SlidesSwitcher {

  /**
   * @param {module:baldr-application/slides~Slides} slides All slide
   *   objects of the current presentation session.
   * @param {module:baldr-application~Document} document The document
   *   object (DOM) of the render process.
   */
  constructor(slides, document) {

    /**
     * All slides index by the slide number.
     * @type {module:baldr-application/slides~Slides}
     */
    this.slides = slides;

    /**
     * The count of all slides.
     * @type {int}
     */
    this.count = Object.keys(this.slides).length;

    /**
     * The current slide number.
     * @type {int}
     */
    this.no = 1;

    /**
     * The document object (DOM) of the render process.
     * @type {module:baldr-application~Document} 
     */
    this.document = document;

    /**
     * @type {object}
     */
    this.elemNavigationButtons = {
      prev: this.document.getElementById('nav-slide-prev'),
      next: this.document.getElementById('nav-slide-next')
    };

    /**
     * A HTML div element, which covers the complete slide area to
     * a void flickering, when new CSS styles are loaded.
     *
     * @type {object}
     */
    this.cover = this.document.getElementById('cover');
  }

  /**
   *
   */
  setVisibility_(state) {
    for (let prop in this.elemNavigationButtons) {
      this.elemNavigationButtons[prop].style.visibility = state;
    }
  }

  /**
   *
   */
  setButtons_() {
    if (this.count > 1) {
      this.setVisibility_('visible');
    }
    else {
      this.setVisibility_('hidden');
    }
  }

  /**
   * Set the background color of the “cover” DIV element.
   *
   * @param {string} color A CSS color information.
   * @param {number} zIndex A CSS color information.
   */
  setCover_(color, zIndex) {
    this.cover.style.backgroundColor = color;
    this.cover.style.zIndex = zIndex;
  }

  /**
   * Set the current slide
   */
  getByNo(no) {
    this.setCover_('black', 1);
    setTimeout(() => {
      this.setCover_('transparent', -1);
    }, 50);

    this.setButtons_();
    return this.slides[this.no];
  }

  /**
   * Set the current slide to the previous slide.
   */
  prev() {
    if (this.no === 1) {
      this.no = this.count;
    }
    else {
      this.no = this.no - 1;
    }
    return this.getByNo(this.no);
  }

  /**
   * Set the current slide to the next slide.
   */
  next() {
    if (this.no === this.count) {
      this.no = 1;
    }
    else {
      this.no = this.no + 1;
    }
    return this.getByNo(this.no);
  }

}

exports.SlidesSwitcher = SlidesSwitcher;
