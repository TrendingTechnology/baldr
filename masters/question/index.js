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
