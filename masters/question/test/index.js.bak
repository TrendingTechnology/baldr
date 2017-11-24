const {
  assert,
  fs,
  path,
  document,
  masters,
  presentation,
  getDOM
} = require('baldr-test');

const {Master} = require('../index.js')(document, masters, presentation);

let propObj = {
  masterName: 'question',
  masterPath: path.resolve(__dirname, '..'),
  document: document,
  presentation: presentation
};

let getQuestion = function(data) {
  propObj.data = data;
  return new Master(propObj);
};

let hookSetHTMLSlide = function(data) {
  propObj.data = data;
  let question = new Master(propObj);
  return question.hookSetHTMLSlide();
};

let dataSingleWithout = 'One?';
let dataSingleWithAnswer = {question: 'One?', answer: 'One'};

let dataMultipleWithout = ['One?', 'Two?'];
let dataMultipleWithAnswer = [
  {question: 'One?', answer: 'One'},
  {question: 'Two?', answer: 'Two'}
];

describe('Master slide “question”: unit tests', () => {

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

    assert.throws(function() {question.normalizeData(false);});
    assert.throws(function() {question.normalizeData(true);});
    assert.throws(function() {question.normalizeData({lol: 'lol', troll: 'troll'});});
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
      let q1 = question.document.querySelector('li:nth-child(1) .question');
      let q2 = question.document.querySelector('li:nth-child(2) .question');
      let q3 = question.document.querySelector('li:nth-child(3) .question');

      assert.equal(question.stepNo, 1);
      assert.equal(q1.style.visibility, 'visible');
      assert.equal(q2.style.visibility, 'hidden');
      assert.equal(q3.style.visibility, 'hidden');

      question.nextStep();
      assert.equal(question.stepNo, 2);
      assert.equal(q2.style.visibility, 'visible');

      question.nextStep();
      assert.equal(question.stepNo, 3);
      assert.equal(q3.style.visibility, 'visible');

      question.nextStep();
      assert.equal(question.stepNo, 1);
      assert.equal(q1.style.visibility, 'visible');
    });

    it('method “prevStep()”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();

      let q1 = question.document.querySelector('li:nth-child(1) .question');
      let q2 = question.document.querySelector('li:nth-child(2) .question');
      let q3 = question.document.querySelector('li:nth-child(3) .question');

      assert.equal(question.stepNo, 1);
      assert.equal(q1.style.visibility, 'visible');
      assert.equal(q2.style.visibility, 'hidden');
      assert.equal(q3.style.visibility, 'hidden');

      question.prevStep();
      assert.equal(question.stepNo, 3);
      assert.equal(q1.style.visibility, 'visible');
      assert.equal(q2.style.visibility, 'visible');
      assert.equal(q3.style.visibility, 'visible');

      question.prevStep();
      assert.equal(question.stepNo, 2);

      question.prevStep();
      assert.equal(question.stepNo, 1);
    });

  });

});
