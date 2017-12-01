const {
  config,
  masters,
  allMasters,
  assert,
  document,
  getDOM,
  path,
  requireFile,
  rewire,
  srcPath
} = require('baldr-test');

let slidesJsPath = srcPath('app', 'slides.js');
const {Slide, getSlides} = require(slidesJsPath);
const Slides = rewire(slidesJsPath).__get__('Slides');

let slide;

/***********************************************************************
 *
 **********************************************************************/

describe('Class “Slide()” #unittest', () => {

  beforeEach(() => {
    slide = new Slide({
      "question": [
        {
          "question": "question",
          "answer": "answer"
        }
      ]},
      getDOM(),
      config,
      masters
    );
  });

  describe('Properties', () => {
    it('Property “this.master”', () => {
      assert.equal(slide.master.name, 'question');
    });

    it('Property “this.rawData”', () => {
      assert.equal(slide.rawData[0].question, 'question');
    });

    it('Property “this.normalizedData”', () => {
      assert.equal(slide.normalizedData[0].question, 'question');
    });

    it('Property “this.steps”', () => {
      assert.equal(slide.steps.constructor.name, 'StepSwitcher');
    });

    it('Property “this.document”', function() {
      assert.equal(typeof slide.document, 'object');
    });

    it('Property “this.elements.slide”', function() {
      assert.equal(slide.elements.slide.id, 'slide-content');
      assert.equal(slide.elements.slide.nodeName, 'DIV');
      assert.equal(slide.elements.slide.nodeType, 1);
    });

    it('Property “this.elements.modal”', function() {
      assert.equal(slide.elements.modal.id, 'modal-content');
      assert.equal(slide.elements.modal.nodeName, 'DIV');
      assert.equal(slide.elements.modal.nodeType, 1);
    });

  });

  describe('Methods', () => {

    it('Method “intersectMastersSlideKeys_()”', () => {
      let array1 = ['one', 'two', 'three'];
      let array2 = ['two'];
      let result = slide.intersectMastersSlideKeys_(['one', 'two', 'three'], ['two']);
      assert.deepEqual(result, ['two']);
      assert.deepEqual(array1, ['one', 'two', 'three']);
      assert.deepEqual(array2, ['two']);

      assert.deepEqual(
        slide.intersectMastersSlideKeys_(['one', 'two', 'three'], ['four']),
        []
      );

      assert.deepEqual(
        slide.intersectMastersSlideKeys_(['one', 'two', 'three'], ['one', 'two', 'three']),
        ['one', 'two', 'three']
      );

      assert.deepEqual(
        slide.intersectMastersSlideKeys_(['one', 'two', 'three'], ['three', 'two', 'one']),
        ['one', 'two', 'three']
      );
    });

    it('Method “set()”', function() {
      slide.set();
      assert.equal(
        slide.document.querySelector('p:nth-child(1)').textContent,
        'question'
      );
    });

  });

  describe('Method “setDataset_()”', () => {
    let dom = getDOM();

    let slide = new Slide({
      "question": [
        {
          "question": "question",
          "answer": "answer"
        }
      ]},
      dom,
      config,
      masters
    );

    slide.setDataset_();

    it('master: <body data-master="masterName">', function() {
      assert.equal(dom.body.dataset.master, 'question');
    });

    it('centerVertically: <body data-center-vertically="true">', function() {
      assert.equal(dom.body.dataset.centerVertically, 'true');
    });

    it('theme: <body data-theme="default">', function() {
      assert.equal(dom.body.dataset.theme, 'default');
    });

  });

});

let rawYaml = [
  {
    "quote": {
      "text": "text",
      "author": "author",
      "date": "date"
    }
  },
  {
    "question": [
      {
        "question": "question",
        "answer": "answer"
      }
    ]
  },
  {
    "person": {
      "name": "name",
      "image": "image"
    }
  }
];

let slidesClass;

/***********************************************************************
 *
 **********************************************************************/

describe('Class “Slides()”', () => {

  beforeEach(() => {
    slidesClass = new Slides(rawYaml, config, getDOM(), masters);
  });

  describe('Properties', () => {
    it('Property “this.rawSlides”', () => {
      assert.equal(typeof slidesClass.rawSlides, 'object');
      assert.equal(slidesClass.rawSlides[0].quote.text, 'text');
    });

    it('Property “this.document”', () => {
      assert.equal(typeof slidesClass.document, 'object');
      assert.equal(slidesClass.document.body.nodeName, 'BODY');
    });

  });

  describe('Methods', () => {

    it('Method “get()”', () => {
      let result = slidesClass.get();
      assert.equal(result[1].master.name, 'quote');
      assert.equal(result[2].master.name, 'question');
      assert.equal(result[3].master.name, 'person');
    });

  });

});
