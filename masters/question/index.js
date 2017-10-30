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
  constructor(document, data) {
    super(document, data);
  }

}


const pug = require('pug');
const path = require('path');

const compiledFunction = pug.compileFile(path.join(__dirname, 'template.pug'));

var render = function(data) {
  let questions = {
    "questions": data
  };
  return compiledFunction(questions);
};

exports.render = render;
exports.Master = Master;
