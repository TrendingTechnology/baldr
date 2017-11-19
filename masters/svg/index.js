/**
 * @file Master slide “svg”
 * @module baldr-master-svg
 */

'use strict';

const {MasterOfMasters} = require('baldr-masters');

/**
 * Master class for the master slide “svg”
 */
class MasterSvg extends MasterOfMasters {
  constructor(document, data) {
    super(document, data);
  }

  /**
   *
   */
  hookSetHTMLSlide() {
    return 'svg';
  }
}

//
// function SVGToggle() {
//   var svg = document.querySelector('#zeichnung');
//   var nodes = svg.firstElementChild.childNodes;
//   nodes.forEach((node) => {
//     if (node.tagName === 'g') {
//       console.log(node.tagName);
//       console.log(node.getAttribute('inkscape:label'));
//     }
//   });
// }
//
// var event = new Event('svgready');
// document.addEventListener('svgready', SVGToggle);
//
// function loadSVGinID(path, targetID) {
//   var xhr = new XMLHttpRequest();
//   xhr.open('GET', path, true);
//   xhr.onload = (e) => {
//     if (xhr.readyState === 4) {
//       if (xhr.status === 200) {
//         document
//           .getElementById(targetID)
//           .appendChild(xhr.responseXML.documentElement);
//           document.dispatchEvent(event);
//       } else {
//         console.error(xhr.statusText);
//       }
//     }
//   };
//   xhr.overrideMimeType('image/svg+xml');
//   xhr.onerror = (e) => {
//     console.error(xhr.statusText);
//   };
//   xhr.send(null);
// }
//
// function onLoad() {
//   loadSVGinID('Zeichnung.svg', 'zeichnung');
// }
//
// window.onload = onLoad;

/**
 * Export the implemented hooks of this master.
 *
 * @param {object} document The HTML Document Object (DOM) of the
 *   current render process.
 * @param {object} masters All required and loaded masters. Using
 *   `masters.masterName` you have access to all exported methods of
 *   a specific master.
 * @param {object} presentation Object representing the current
 *   presentation session.
 *
 * @return {object} A object, each property represents a hook.
 */
module.exports = function(document, masters, presentation) {
  let _export = {};
  _export.Master = MasterSvg;
  return _export;
};
