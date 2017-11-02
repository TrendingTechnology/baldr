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
    return '';
  }

  /**
   *
   */
  template(normalizedData) {
    return '`<li>${question}: ${answer}</li>`';
  }

  /**
   *
   */
  renderQuestion(question, answer) {
    return `<li>${question}: ${answer}</li>`;
  }

  /**
   *
   */
  setHTMLSlide() {
    let out = '';
    for (let question of this.data) {
      out = out + this.renderQuestion(question.question, question.answer);
    }
    return `<ul>${out}</ul>`;
  }

}

exports.MasterQuestion = MasterQuestion;
