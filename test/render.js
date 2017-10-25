// const assert = require('assert');
//
// const jsdom = require('jsdom');
// const {JSDOM} = jsdom;
// let DOM = new JSDOM(`<html>
//   <head>
//     <title>baldr - BALDUR</title>
//     <meta charset="utf-8" />
//   </head>
//   <body>
//     <div id="slide">Currently no slide is loaded!</div>
//   </body>
// </html>`);
// var document = DOM.window.document;
//
// var remote = {
//   process: {
//     argv: ['lol']
//   }
// };
//
// const rewire = require('rewire')('../render.js');
//
// let main = rewire.__get__('main');
//
// rewire.__set__('document', document);
// rewire.__set__('remote.process.argv', ['lol']);
//
// main();


//const render = require('../render.js');
