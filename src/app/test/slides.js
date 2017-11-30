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
      assert.equal(result[1].master, 'quote');
      assert.equal(result[2].master, 'question');
      assert.equal(result[3].master, 'person');
    });

  });

});
