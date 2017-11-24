const path = require('path');

let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {
  getMasters,
  setMain
} = requireLib('masters');
const {getSlides} = requireLib('slides');
const {SlidesSwitcher} = requireLib('slides-switcher');
const {getThemes} = requireLib('themes');

module.exports = {
  getMasters: getMasters,
  getSlides: getSlides,
  SlidesSwitcher: SlidesSwitcher,
  getThemes: getThemes
};
