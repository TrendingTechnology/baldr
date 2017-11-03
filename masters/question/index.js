/**
 * @file Master slide “question”
 * @module masters/question
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

/**
 * Master class for the master slide “question”
 *
 * Types:
 *  - single
 *    - without answer
 *    - with answer
 *  - multiple
 *    - without answer
 *    - with answer
 */
class MasterQuestion extends MasterOfMasters {

  constructor(propObj) {
    super(propObj);
  }

  /**
   *
   */
  normalizeDataQAPair(pair) {
    if (typeof pair === 'string') {
      return {question: pair, answer: false};
    }
    else if (typeof pair === 'object') {
      if (typeof pair.question === 'string' && !pair.answer) {
        return {question: pair.question, answer: false};
      }
      else if (typeof pair.question === 'string' && typeof pair.answer === 'string') {
        return {question: pair.question, answer: pair.answer};
      }
      else {
        throw new Error('Master slide “question”: Invalid data input');
      }
    }
    else {
      throw new Error('Master slide “question”: Invalid data input');
    }
  }

  /**
   *
   */
  normalizeData(data) {
     if (typeof data === 'object' && Array.isArray(data)) {
      let out = [];
      for (let pair of data) {
        out.push(this.normalizeDataQAPair(pair));
      }
      return out;
    } else {
      return [this.normalizeDataQAPair(data)];
    }
  }

  /**
   *
   */
  templatQAPair(question, answer) {
    let out = '';
    if (question) {
      out += `<p class="question">${question}</p>`;
    }
    if (answer) {
      out += `<p class="answer">${answer}</p>`;
    }
    return out;
  }

  /**
   *
   */
  setStepByNo(no) {
    for (let i = 1; i <= this.stepCount; i++) {
      if (!this.stepData[i].style.visibility) {
        this.stepData[i].style.visibility = 'visible';
      }

      let visibility = this.stepData[i].style.visibility;
      if (visibility === 'visible' && no < i) {
        this.stepData[i].style.visibility = 'hidden';
      }
      else if (visibility === 'hidden' && no >= i) {
        this.stepData[i].style.visibility = 'visible';
      }
    }
  }

  /**
   *
   */
  template(data) {
    if (data.length > 1) {
      let li = '';
      for (let pair of data) {
        li +=
          '<li>' +
          this.templatQAPair(pair.question, pair.answer) +
          '</li>';
      }
      return `<ol>${li}</ol>`;
    }
    else {
      return this.templatQAPair(data[0].question, data[0].answer);
    }
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    let data = this.normalizeData(this.data);
    return '<div id="question-content">' +
      this.template(data) +
      '</div>';
  }

  /**
   *
   */
  hookPostFirstSet() {
    this.stepNo = 1;
  }

  /**
   * The stepData object has to be filled very time a slide is set.
   * Every time a slide is set, new HTML elements are generated.
   */
  hookPostSet() {
    let elements = this.document.querySelectorAll('p');
    this.stepCount = elements.length;
    elements.forEach((element, index) => {
      this.stepData[index + 1] = element;
    });

    this.setStepByNo(this.stepNo);
  }

  /**
   *
   */
  hookSetStep() {
    this.setStepByNo(this.stepNo);
  }

}

exports.MasterQuestion = MasterQuestion;
