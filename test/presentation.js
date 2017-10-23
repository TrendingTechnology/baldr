const assert = require('assert');
const rewire = require('rewire')('../presentation.js');
const path = require('path');
const {Presentation} = require('../presentation.js');

describe('Other functions', () => {

  it('Function “searchForBaldrFile()”', () => {
    let search = rewire.__get__('searchForBaldrFile');
    assert.equal(
      search(['lol.baldr']),
      'lol.baldr'
    );

    assert.equal(
      search(['lol.BALDR']),
      'lol.BALDR'
    );

    assert.equal(
      search(['lil', 'lol.BALDR', 'troll']),
      'lol.BALDR'
    );

    assert.equal(
      search(['lil', 'troll']),
      false
    );

    assert.equal(
      search(['first.baldr', 'last.baldr']),
      'last.baldr'
    );
  });
});

describe('Class “Slides()”', () => {

  it('Method “readYamlFile()”', () => {
    let Slides = rewire.__get__('Slides');
    let slides = new Slides('example.baldr');
    let yml = slides.readYamlFile('example.baldr');
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });

  it('Method “parseSlide()”', () => {
    let Slides = rewire.__get__('Slides');
    let slides = new Slides('example.baldr');

    assert.deepEqual(
      slides.parseSlide(
        {
          "quote": {
            "text": "text",
            "author": "author",
            "date": "date"
          }
        },
        0
      ),
      {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "text",
          "author": "author",
          "date": "date"
        },
        "css": true
      }
    );
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

    let result = {
      "1": {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "text",
          "author": "author",
          "date": "date"
        },
        "css": true
      },
      "2": {
        "no": 2,
        "master": "question",
        "data": [
          {
            "question": "question",
            "answer": "answer"
          },

        ],
        "css": false
      },
      "3": {
        "no": 3,
        "master": "person",
        "data": {
          "name": "name",
          "image": "image"
        },
        "css": false
      }
    };

    let Slides = rewire.__get__('Slides');
    let slides = new Slides('example.baldr');
    assert.deepEqual(slides.parseSlides(rawYaml), result);
  });

  it('Methode “parse()”', () => {
    let result = {
      "1": {
        "no": 1,
        "master": "quote",
        "data": {
          "text": "Der Tag der Gunst ist wie der Tag der Ernte,\nman muss geschäftig sein sobald sie reift.\n",
          "author": "Johann Wolfgang von Goethe",
          "date": 1801
        },
        "css": true
      },
      "2": {
        "no": 2,
        "master": "question",
        "data": [
          {
            "question": "Wann starb Ludwig van Beethoven?",
            "answer": 1827
          }
        ],
        "css": false
      },
      "3": {
        "no": 3,
        "master": "person",
        "data": {
          "name": "Ludwig van Beethoven",
          "image": "beethoven.jpg"
        },
        "css": false
      }
    };

    let Slides = rewire.__get__('Slides');
    let slides = new Slides('example.baldr');
    assert.deepEqual(slides.parse(), result);
  });

});

describe('Class “Presentation()”', () => {
  beforeEach(function() {
    this.prs = new Presentation('example.baldr');
  });

  it('Properties', function() {
    assert.equal(this.prs.slides[1].master, 'quote');
    assert.equal(this.prs.count, 3);
    assert.equal(this.prs.no, 1);
    assert.equal(this.prs.pwd, path.resolve(path.dirname('example.baldr')));
    assert.equal(this.prs.currentSlide.master, 'quote');
    assert.equal(this.prs.HTML, '');
  });

  it('Method “prev()”', function() {
    this.prs.prev();
    assert.equal(this.prs.no, 3);
    this.prs.prev();
    assert.equal(this.prs.no, 2);
    this.prs.prev();
    assert.equal(this.prs.no, 1);
    this.prs.prev();
    assert.equal(this.prs.no, 3);
  });

  it('Method “next()”', function() {
    this.prs.next();
    assert.equal(this.prs.no, 2);
    this.prs.next();
    assert.equal(this.prs.no, 3);
    this.prs.next();
    assert.equal(this.prs.no, 1);
    this.prs.next();
    assert.equal(this.prs.no, 2);
  });

  it('Method “render()”', function() {
    this.prs.render();
    let html = this.prs.HTML;
    assert.ok(html.includes('Johann Wolfgang von Goethe'));
  });

  it('Method “output()”', function() {
    let html = this.prs.render().output();
    assert.ok(html.includes('Johann Wolfgang von Goethe'));
  });

  it('Method chaining', function() {
    let html = this.prs.next().render().output();
    assert.ok(html.includes('Ludwig van Beethoven'));
  });
});
