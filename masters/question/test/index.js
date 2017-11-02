const {
  assert,
  fs,
  path,
  document,
  presentation,
  getDOM
} = require('../../../test/lib/helper.js');

const {MasterQuestion} = require('../index.js');

let propObj = {
  masterName: 'question',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let getQuestion = function(data) {
  propObj.data = data;
  return new MasterQuestion(propObj);
};

let setHTMLSlide = function(data) {
  propObj.data = data;
  let question = new MasterQuestion(propObj);
  return quote.setHTMLSlide();
};

let dataOne = 'One big question?';
let dataMultiple = ['One?', 'Two?', 'Three?'];

describe('Master slide “quote”', () => {

  it('function “setHTMLSlide()”: all values', () => {
    let html = render({
      text: 'text',
      author: 'author',
      date: 'date'
    });


  });

});
