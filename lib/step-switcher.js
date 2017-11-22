/**
 * @file
 * @module lib/step-switcher
 */

/**
 * Some masters support steps. Steps are switched by the up and down
 * arrow keys. Steps are the second level in the hierachy of state
 * changes. On the first level are slides.
 */
class StepSwitcher {

  constructor(document, slide, master) {

    /**
     * The HTML-Button-Element that triggers the previous step.
     * @type {object}
     */
    this.elemPrev = this.document.getElementById('nav-step-prev');

    /**
     * The HTML-Button-Element that triggers the next step.
     * @type {object}
     */
    this.elemNext = this.document.getElementById('nav-step-next');

    /**
     * The count of steps. (Default: 0)
     * @type {integer}
     */
    this.count = 0;

    /**
     * The current step number. (Default: 0)
     * @type {integer}
     */
    this.no = 0;

    /**
     * Object to store data for the individual steps. The step data
     * should be indexed by the step number.
     * @type {object}
     */
    this.data = {};

  }
  /**
   * @private
   */
  setStepButtonsVisibility_(state) {
    this.elemNext.style.visibility = state;
    this.elemPrev.style.visibility = state;
  }
  /**
   *
   */
  prev() {
    if (this.no === 1) {
      this.no = this.count;
    }
    else {
      this.no--;
    }
  }

  /**
   *
   */
  next() {
    if (this.no === this.count) {
      this.no = 1;
    }
    else {
      this.no++;
    }
  }

}
