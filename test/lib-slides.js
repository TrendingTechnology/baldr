const {
  allMasters,
  assert,
  document,
  getDOM,
  path,
  presentation
} = require('./lib/helper.js');

const rewire = require('rewire')('../lib/slides.js');
const {Slides} = require('../lib/slides.js');

const minimal = path.join('test', 'files', 'minimal.baldr');

describe('Class “Slides()”', () => {

  it('Method “readYamlFile()”', () => {
    let slides = new Slides(minimal, document);
    let yml = slides.readYamlFile(minimal);
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });

  it('Method “parseSlides()”', () => {
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

    let slides = new Slides(minimal, document);
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

    let slides = new Slides(minimal, document);
    let slide = slides.instantiateSlide(rawSlideObj, 0);
    assert.equal(slide.slideNo, 1);
    assert.equal(slide.masterName, 'quote');
    assert.equal(typeof slide.setHTMLSlide, 'function');
    assert.equal(typeof slide.setHTMLModal, 'function');

  });

  it('Method “parse()”', () => {
    let slides = new Slides(minimal, document);
    let result = slides.parse();
    assert.equal(result[1].masterName, 'quote');
    assert.equal(result[2].masterName, 'question');
    assert.equal(result[3].masterName, 'person');
  });

});
