const assert = require('assert');
const rewire = require('rewire')('../presentation.js');
const {Presentation} = require('../presentation.js');

describe('module “slides.js”', () => {

  it('function “loadYaml()”', () => {
    let loadYaml = rewire.__get__('loadYaml');
    let yml = loadYaml('presentation.yml');
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });

  it('function “processYaml()”', () => {
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

    let result = {
      "1": {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "text",
          "author": "author",
          "date": "date"
        }
      },
      "2": {
        "no": 2,
        "master": "question",
        "data": [
          {
            "question": "question",
            "answer": "answer"
          }
        ]
      },
      "3": {
        "no": 3,
        "master": "person",
        "data": {
          "name": "name",
          "image": "image"
        }
      }
    };

    let processYaml = rewire.__get__('processYaml');
    let out = processYaml(rawYaml);
    assert.deepEqual(out, result);
  });

});

describe('Class “Presentation()”', () => {
  beforeEach(function() {
    this.prs = new Presentation('presentation.yml');
  });

  it('Properties', function() {
    assert.equal(this.prs.count, 3);
    assert.equal(this.prs.no, 1);
    assert.equal(this.prs.slides[1].master, 'quote');
  });

  it('Methode “prev()”', function() {
    this.prs.prev();
    assert.equal(this.prs.no, 3);
    this.prs.prev();
    assert.equal(this.prs.no, 2);
    this.prs.prev();
    assert.equal(this.prs.no, 1);
    this.prs.prev();
    assert.equal(this.prs.no, 3);
  });

  it('Methode “next()”', function() {
    this.prs.next();
    assert.equal(this.prs.no, 2);
    this.prs.next();
    assert.equal(this.prs.no, 3);
    this.prs.next();
    assert.equal(this.prs.no, 1);
    this.prs.next();
    assert.equal(this.prs.no, 2);
  });

  it('Methode “render()”', function() {
    this.prs.render();
    let html = this.prs.HTML;
    assert.ok(html.includes('Johann Wolfgang von Goethe'));
  });

  it('Methode “output()”', function() {
    let html = this.prs.render().output();
    assert.ok(html.includes('Johann Wolfgang von Goethe'));
  });

  it('Methode chaining', function() {
    let html = this.prs.next().render().output();
    assert.ok(html.includes('Ludwig van Beethoven'));
  });
});
