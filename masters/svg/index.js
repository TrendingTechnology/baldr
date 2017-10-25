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

exports.render = function(data, presentation) {

};
