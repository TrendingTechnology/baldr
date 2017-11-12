const {
  allMasters,
  assert,
  document,
  getDOM,
  path,
  presentation
} = require('baldr-test');

const rewire = require('rewire')('../lib/slides.js');
const {Slides} = require('../lib/slides.js');

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

describe('Class “Slides()”', () => {

  it('Method “parseSlides()”', () => {

    let slides = new Slides(rawYaml, document);
    let result = slides.parseSlides(rawYaml);
    assert.equal(result[1].masterName, 'quote');
    assert.equal(result[2].masterName, 'question');
    assert.equal(result[3].masterName, 'person');
  });

  it('Method “instantiateSlides()”', () => {
    let rawSlideObj = {
        "quote": {
          "text": "text",
          "author": "author",
          "date": "date"
        }
      };

    let slides = new Slides(rawYaml, document);
    let slide = slides.instantiateSlide(rawSlideObj, 0);
    assert.equal(slide.slideNo, 1);
    assert.equal(slide.masterName, 'quote');
    assert.equal(typeof slide.hookSetHTMLSlide, 'function');
    assert.equal(typeof slide.hookSetHTMLModal, 'function');
  });

  it('Method “parse()”', () => {
    let slides = new Slides(rawYaml, document);
    let result = slides.parse();
    assert.equal(result[1].masterName, 'quote');
    assert.equal(result[2].masterName, 'question');
    assert.equal(result[3].masterName, 'person');
  });

  it('Method “intersectMastersSlideKeys()”', () => {
    let slides = new Slides(rawYaml, document);
    let array1 = ['one', 'two', 'three'];
    let array2 = ['two'];
    let result = slides.intersectMastersSlideKeys(['one', 'two', 'three'], ['two']);
    assert.deepEqual(result, ['two']);
    assert.deepEqual(array1, ['one', 'two', 'three']);
    assert.deepEqual(array2, ['two']);

    assert.deepEqual(
      slides.intersectMastersSlideKeys(['one', 'two', 'three'], ['four']),
      []
    );

    assert.deepEqual(
      slides.intersectMastersSlideKeys(['one', 'two', 'three'], ['one', 'two', 'three']),
      ['one', 'two', 'three']
    );

    assert.deepEqual(
      slides.intersectMastersSlideKeys(['one', 'two', 'three'], ['three', 'two', 'one']),
      ['one', 'two', 'three']
    );
  });

});
