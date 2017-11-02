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

let dataSingleWithout = 'One?';
let dataSingleWithAnswer = {question: 'One?', answer: 'One'};

let dataMultipleWithout = ['One?', 'Two?'];
let dataMultipleWithAnswer = [
  {question: 'One?', answer: 'One'},
  {question: 'Two?', answer: 'Two'}
];

describe('Master slide “question”', () => {

  it('function “normalizeData()”', () => {
    let question = getQuestion('');

    assert.deepEqual(
      question.normalizeData(dataSingleWithout),
      [{question: 'One?', answer: false}]
    );

    assert.deepEqual(
      question.normalizeData(dataSingleWithAnswer),
      [{question: 'One?', answer: 'One'}]
    );

    assert.deepEqual(
      question.normalizeData(dataMultipleWithout),
      [
        {question: 'One?', answer: false},
        {question: 'Two?', answer: false}
      ]
    );

    assert.deepEqual(
      question.normalizeData(dataMultipleWithAnswer),
      [
        {question: 'One?', answer: 'One'},
        {question: 'Two?', answer: 'Two'}
      ]
    );

    // let invalidData = function(data) {
    //   try {
    //     question.normalizeData(data);
    //   }
    //   catch(error) {
    //     assert.equal(error.message, 'Master slide “question”: Invalid data input');
    //     throw error;
    //   }
    // }
    //
    // invalidData(false);
    // invalidData(true);
    // invalidData({lol: 'lol', troll: 'troll'});
  });

});
