const path = require('path');

let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {Config} = requireLib('config');
const {
  addCSSFile,
  reIndex
} = requireLib('helper');
const {Media} = requireLib('media');

module.exports = {
  addCSSFile: addCSSFile,
  Config: Config,
  Media: Media,
  reIndex: reIndex
};
