const assert = require('assert');
const rewire = require('rewire')('../presentation.js');
const {Presentation} = require('../presentation.js');

describe('Class “Slides()”', () => {


  it.skip('Method “readYamlFile()”', () => {
    let readYamlFile = rewire.__get__('readYamlFile');
    let yml = loadYaml('presentation.yml');
    assert.equal(yml[0].quote.author, 'Johann Wolfgang von Goethe');
    assert.equal(yml[1].question[0].answer, 1827);
  });

  it.skip('Method “parse()”', () => {
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

    var parse = rewire.__get__('Slides.parse');
    assert.deepEqual(parse(rawYaml), result);
  });


  it.skip('new Slides()', () => {
    // let rawYaml = [
    //   {
    //     "quote": {
    //       "text": "text",
    //       "author": "author",
    //       "date": "date"
    //     }
    //   },
    //   {
    //     "question": [
    //       {
    //         "question": "question",
    //         "answer": "answer"
    //       }
    //     ]
    //   },
    //   {
    //     "person": {
    //       "name": "name",
    //       "image": "image"
    //     }
    //   }
    // ];

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

    //let processYaml = rewire.__get__('processYaml');
    //let out = processYaml(rawYaml);
    var Slides = rewire.__get__('Slides');

    let slides = new Slides('presentation.yml');
    assert.deepEqual(slides, result);
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
