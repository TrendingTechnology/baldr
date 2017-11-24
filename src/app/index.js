const path = require('path');

let requireLib = function(fileName) {
  return require(path.join(__dirname, fileName + '.js'));
};

const {StepSwitcher} = requireLib('step-switcher');
const {SlidesSwitcher} = requireLib('slides-switcher');
const {getSlides} = requireLib('slides');

module.exports = {
  getSlides: getSlides,
  SlidesSwitcher: SlidesSwitcher,
  StepSwitcher: StepSwitcher
};
