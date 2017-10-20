const pug = require('pug');

const compiledFunction = pug.compileFile('masters/question/template.pug');

var render = function(data) {
  let questions = {
    "questions": data
  };
  return compiledFunction(questions);
};

exports.render = render;
