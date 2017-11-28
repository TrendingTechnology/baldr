const {
  assert,
  makeDOM,
  rewire,
  path
} = require('baldr-test');

const question = require('../index.js');
const questionRewired = rewire(path.join(__dirname, '..', 'index.js'));

let normalizeData = function(data) {
  return question.normalizeData(data);
};

let mainHTML = function(data) {
  normalizedData = question.normalizeData(data);
  return question.mainHTML({normalizedData: normalizedData});
};

let dataSingleWithout = 'One?';
let dataSingleWithAnswer = {question: 'One?', answer: 'One'};

let dataMultipleWithout = ['One?', 'Two?'];
let dataMultipleWithAnswer = [
  {question: 'One?', answer: 'One'},
  {question: 'Two?', answer: 'Two'}
];

describe('Master slide “question” #unittest', () => {

  it('method “normalizeData()”', () => {
    assert.deepEqual(
      normalizeData(dataSingleWithout),
      [{question: 'One?', answer: false}]
    );

    assert.deepEqual(
      normalizeData(dataSingleWithAnswer),
      [{question: 'One?', answer: 'One'}]
    );

    assert.deepEqual(
      normalizeData(dataMultipleWithout),
      [
        {question: 'One?', answer: false},
        {question: 'Two?', answer: false}
      ]
    );

    assert.deepEqual(
      normalizeData(dataMultipleWithAnswer),
      [
        {question: 'One?', answer: 'One'},
        {question: 'Two?', answer: 'Two'}
      ]
    );

    assert.throws(function() {normalizeData(false);});
    assert.throws(function() {normalizeData(true);});
    assert.throws(function() {normalizeData({lol: 'lol', troll: 'troll'});});
  });


  it('Method “templatQAPair()”', () => {
    const templatQAPair = questionRewired.__get__('templatQAPair');
    let html = templatQAPair('question', 'answer');
    let dom = makeDOM(html);
    assert.equal(
      dom.querySelector('.question').textContent,
      'question'
    );
    assert.equal(
      dom.querySelector('.answer').textContent,
      'answer'
    );
  });

  it('Method “templatQAPair()”: answer empty string', () => {
    const templatQAPair = questionRewired.__get__('templatQAPair');
    let html = templatQAPair('question', '');
    let dom = makeDOM(html);
    assert.equal(
      dom.querySelector('.answer'),
      null
    );
  });

  it('Method “mainHTML()”: dataSingleWithout', () => {
    let html = mainHTML(dataSingleWithout);
    let dom = makeDOM(html);
    assert.equal(
      dom.querySelector('.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('.answer'),
      null
    );
  });

  it('Method “mainHTML()”: dataSingleWithAnswer', () => {
    let html = mainHTML(dataSingleWithAnswer);
    let dom = makeDOM(html);
    assert.equal(
      dom.querySelector('.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('.answer').textContent,
      'One'
    );
  });

  it('Method “mainHTML()”: dataMultipleWithout', () => {
    let html = mainHTML(dataMultipleWithout);
    let dom = makeDOM(html);
    assert.equal(
      dom.querySelector('ol li:nth-child(1) p.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('ol li:nth-child(2) p.answer'),
      null
    );
  });

  it('Method “mainHTML()”: dataMultipleWithAnswer', () => {
    let html = mainHTML(dataMultipleWithAnswer);
    let dom = makeDOM(html);
    assert.equal(
      dom.querySelector('ol li:nth-child(1) p.question').textContent,
      'One?'
    );
    assert.equal(
      dom.querySelector('ol li:nth-child(2) p.answer').textContent,
      'Two'
    );
  });

  describe.skip('Step support', function(){

    it('Property “this.alreadySet”', () => {
      let question = getQuestion(['1', '2', '3']);
      assert.equal(question.alreadySet, false);
      question.set();
      assert.equal(question.alreadySet, true);
    });

    it('Property “this.stepCount”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();
      assert.equal(question.stepCount, 3);
    });

    it('Property “this.stepData”', () => {
      let question = getQuestion(['1', '2', '3']);
      question.set();
      assert.equal(question.stepData[1].tagName, 'P');
      assert.equal(question.stepData[2].tagName, 'P');
      assert.equal(question.stepData[3].tagName, 'P');
    });

    it('Method “nextStep()”', () => {
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

    it('Method “prevStep()”', () => {
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
