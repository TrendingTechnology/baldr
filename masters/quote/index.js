const pug = require('pug');

const compiledFunction = pug.compileFile('masters/quote/template.pug');

var render = function(data) {
  return compiledFunction(data);
};

exports.render = render;
