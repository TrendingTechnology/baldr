/**
 * @file Master slide “person”
 * @module baldr-master-person
 */

'use strict';

/**
 *
 */
exports.mainHTML = function(slide, config, document) {
  let data = slide.normalizedData;
  return `
<section id="master-person">

  <img src="${config.sessionDir}/${data.image}">

  <div id="info-box">
    <p>${data.name}</p>
  </div>

</section>
`;
};
