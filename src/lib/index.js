const path = require('path');

let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {Config} = requireLib('config');
const {
  addCSSFile,
  reIndex
} = requireLib('helper');
const {
  masters,
  setMain
} = requireLib('masters');
const {Themes} = requireLib('themes');
const {Media} = requireLib('media');

module.exports = {
  addCSSFile: addCSSFile,
  Config: Config,
  getSlides: getSlides,
  masters: masters,
  Media: Media,
  reIndex: reIndex,
  setMain: setMain
  Themes: Themes
};
