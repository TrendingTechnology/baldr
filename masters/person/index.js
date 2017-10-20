const pug = require('pug');

const compiledFunction = pug.compileFile('masters/person/template.pug');

var render = function(data) {
  return compiledFunction(data);
};

exports.render = render;
