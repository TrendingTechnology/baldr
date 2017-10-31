/**
 * @file Master slide “question”
 * @module masters/question
 */

'use strict';

const {MasterOfMasters} = require('../../lib/masters');

/**
 * Master class for the master slide “question”
 * @class
 * @alias MasterQuestion
 */
class Master extends MasterOfMasters {
  constructor(propObj) {
    super(propObj);
  }

  renderQuestion(question, answer) {
    return `<li>${question}: ${answer}</li>`;
  }

  render() {
    let out = '';
    for (let question of this.data) {
      out = out + this.renderQuestion(question.question, question.answer);
    }
    return `<ul>${out}</ul>`;
  }

}

exports.Master = Master;
