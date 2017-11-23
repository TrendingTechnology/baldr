/**
 * @file
 * @module lib/step-switcher
 */

const {masters} = require('baldr-masters');

/**
 * Some masters support steps. Steps are switched by the up and down
 * arrow keys. Steps are the second level in the hierachy of state
 * changes. On the first level are slides.
 */
class StepSwitcher {

  constructor(document, slide, config) {
    this.document = document;

    this.master = masters[slide.master];

    /**
     * The HTML-Button-Element that triggers the previous step.
     * @type {object}
     */
    this.elements = {
      prev: document.getElementById('nav-step-prev'),
      next: document.getElementById('nav-step-next')
    }

    /**
     * Object to store data for the individual steps. The step data
     * should be indexed by the step number.
     * @type {object}
     */
    this.stepsData = this.master.initSteps(document, slide, config);

    /**
     * The count of steps. (Default: 0)
     * @type {integer}
     */
    if (this.stepsData) {
      this.count = Object.keys(this.stepsData).length;
    }
    else {
      this.count = 0;
    }

    this.stepSupport = this.count > 0;

    /**
     * The current step number. (Default: 0)
     * @type {integer}
     */
    this.no = 0;
  }

  /**
   * @private
   */
  setButtonsVisibility_(state) {
    this.elements.prev.style.visibility = state;
    this.elements.next.style.visibility = state;
  }

  setByNo(no) {
    master.setStepsByNo(no, this.count, this.stepData, this.document);
  }

  init() {
    if (this.stepSupport) {
      setByNo(this.no);
      setButtonsVisibility_('visible');
    }
    else {
      setButtonsVisibility_('hidden');
    }
  }

  /**
   *
   */
  prev() {
    if (this.stepSupport) {
      if (this.no === 1) {
        this.no = this.count;
      }
      else {
        this.no--;
      }
      this.setByNo(this.no);
    }
  }

  /**
   *
   */
  next() {
    if (this.stepSupport) {
      if (this.no === this.count) {
        this.no = 1;
      }
      else {
        this.no++;
      }
      this.setByNo(this.no);
    }
  }
}

exports.StepSwitcher = StepSwitcher;
