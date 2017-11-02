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
  normalizeData(data) {
    return `<li>${question}: ${answer}</li>`;
  }

  /**
   *
   */
  renderQuestionAnswerPair(question, answer) {
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
