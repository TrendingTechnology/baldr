const pug = require('pug');
const path = require('path');

const compiledFunction = pug.compileFile(path.join(__dirname, 'template.pug'));

exports.render = function(data) {
  return compiledFunction(data);
};
