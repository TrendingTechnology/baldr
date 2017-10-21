const assert = require('assert');
const rewire = require('rewire')('../yml.js');

describe('module “yml.js”', () => {

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

  it('function exported by module.exports', () => {
    let slides = require('../yml.js')('presentation.yml');
    assert.equal(slides[1].master, 'quote');
    assert.equal(slides[2].master, 'question');
    assert.equal(slides[3].master, 'person');
  });

});
