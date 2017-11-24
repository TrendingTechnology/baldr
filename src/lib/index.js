const path = require('path');

let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {
  addCSSFile,
  masters,
  reIndex,
  setMain
} = requireLib('masters');
const {StepSwitcher} = requireLib('step-switcher');
const {SlidesSwitcher} = requireLib('slides-switcher');
const {getSlides} = requireLib('slides');
const {Themes} = requireLib('themes');
const {Config} = requireLib('config');
const {Media} = requireLib('media');

module.exports = {
  addCSSFile: addCSSFile,
  Config: Config,
  getSlides: getSlides,
  masters: masters,
  Media: Media,
  reIndex: reIndex,
  setMain: setMain,
  StepSwitcher: StepSwitcher,
  Themes: Themes
};
