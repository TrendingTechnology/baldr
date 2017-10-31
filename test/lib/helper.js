const path = require('path');
const fs = require('fs');
const {JSDOM} = require('jsdom');

exports.getDOM = getDOM = function(html) {
  let d = new JSDOM(html);
  return d.window.document;
};

exports.allMasters = [
  'audio',
  'camera',
  'editor',
  'person',
  'question',
  'quote',
  'svg'
];

exports.document = getDOM(
  fs.readFileSync(
    path.join(__dirname, '..', '..', 'render.html'),
    'utf8'
  )
);

exports.presentation = {
  pwd: '/home/jf/lol'
};
