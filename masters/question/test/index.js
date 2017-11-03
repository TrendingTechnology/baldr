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

let hookSetHTMLSlide = function(data) {
  propObj.data = data;
  let question = new MasterQuestion(propObj);
  return quote.hookSetHTMLSlide();
};

let dataSingleWithout = 'One?';
let dataSingleWithAnswer = {question: 'One?', answer: 'One'};

let dataMultipleWithout = ['One?', 'Two?'];
let dataMultipleWithAnswer = [
  {question: 'One?', answer: 'One'},
  {question: 'Two?', answer: 'Two'}
];

describe('Master slide “question”', () => {

  it('method “normalizeData()”', () => {
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

    // TODO: Test error handling
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


  it('method “templatQAPair()”', () => {
    let question = getQuestion('');
    let html = question.templatQAPair('question', 'answer');
    let dom = getDOM(html);
    assert.equal(
      dom.querySelector('.question').textContent,
      'question'
    );
    assert.equal(
      dom.querySelector('.answer').textContent,
      'answer'
    );
  });

  it('method “templatQAPair()”: answer empty string', () => {
    let question = getQuestion('');
    let html = question.templatQAPair('question', '');
    let dom = getDOM(html);
    assert.equal(
      dom.querySelector('.answer'),
      null
    );
  });

  it('method “hookSetHTMLSlide()”: dataSingleWithout', () => {
    let question = getQuestion(dataSingleWithout);
    let html = question.hookSetHTMLSlide();
    let dom = getDOM(html);
    assert.equal(
      dom.querySelector('.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('.answer'),
      null
    );
  });

  it('method “hookSetHTMLSlide()”: dataSingleWithAnswer', () => {
    let question = getQuestion(dataSingleWithAnswer);
    let html = question.hookSetHTMLSlide();
    let dom = getDOM(html);
    assert.equal(
      dom.querySelector('.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('.answer').textContent,
      'One'
    );
  });

  it('method “hookSetHTMLSlide()”: dataMultipleWithout', () => {
    let question = getQuestion(dataMultipleWithout);
    let html = question.hookSetHTMLSlide();
    let dom = getDOM(html);
    assert.equal(
      dom.querySelector('ol li:nth-child(1) p.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('ol li:nth-child(2) p.answer'),
      null
    );
  });

  it('method “hookSetHTMLSlide()”: dataMultipleWithAnswer', () => {
    let question = getQuestion(dataMultipleWithAnswer);
    let html = question.hookSetHTMLSlide();
    let dom = getDOM(html);
    assert.equal(
      dom.querySelector('ol li:nth-child(1) p.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('ol li:nth-child(2) p.answer').textContent,
      'Two'
    );
  });

  describe('Step support', function(){

    it('property “this.alreadySet”', () => {
      let question = getQuestion(['1', '2', '3']);
      assert.equal(question.alreadySet, false);
      question.set();
      assert.equal(question.alreadySet, true);
    });

    it('property “this.stepCount”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();
      assert.equal(question.stepCount, 3);
    });

    it('property “this.stepData”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();
      assert.equal(question.stepData[1].tagName, 'P');
      assert.equal(question.stepData[2].tagName, 'P');
      assert.equal(question.stepData[3].tagName, 'P');
    });

    it('method “nextStep()”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();

      assert.equal(question.stepNo, 1);

      question.nextStep();
      assert.equal(question.stepNo, 2);

      question.nextStep();
      assert.equal(question.stepNo, 3);

      question.nextStep();
      assert.equal(question.stepNo, 1);
    });

    it('method “prevStep()”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();

      assert.equal(question.stepNo, 1);

      question.prevStep();
      assert.equal(question.stepNo, 3);

      question.prevStep();
      assert.equal(question.stepNo, 2);

      question.prevStep();
      assert.equal(question.stepNo, 1);
    });

  });

});
