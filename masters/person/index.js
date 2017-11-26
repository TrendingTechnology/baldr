/**
 * @file Master slide “person”
 * @module baldr-master-person
 */

'use strict';

const {Media, checkProperty} = require('baldr-library');

exports.documentation = {
  examples: [
`
- person:
     name: Ludwig van Beethoven
     image: images/beethoven.jpg
     birth: 1770
     death: 1827
`
  ]
};

/**
 *
 */
exports.normalizeData = function(rawSlideData, config) {
  let data = {};

  if (checkProperty.isString(rawSlideData, 'name')) {
    data.name = rawSlideData.name;
  }

  let images = new Media(config.sessionDir);
  let image = images.list(rawSlideData.image, 'image');
  if (image && image !== [] && image[0] && image[0].hasOwnProperty('path')) {
    data.imagePath = image[0].path;
  }

  if (!checkProperty.empty(rawSlideData, 'birth')) {
    data.birth = '* ' + rawSlideData.birth;
  }
  else {
    data.birth = '';
  }

  if (!checkProperty.empty(rawSlideData, 'death')) {
    data.death = '† ' + rawSlideData.death;
  }
  else {
    data.death = '';
  }

  if (
    !checkProperty.empty(rawSlideData, 'birth') ||
    !checkProperty.empty(rawSlideData, 'death')
  ) {
    data.birthAndDeath = true;
  }
  else {
    data.birthAndDeath = false;
  }

  return data;
};

/**
 *
 */
exports.mainHTML = function(slide, config, document) {
  let data = slide.normalizedData;

  let birthAndDeath;
  if (data.birthAndDeath) {
    birthAndDeath = `<p class="birth-and-death">${data.birth} ${data.death}</p>`;
  }
  else {
    birthAndDeath = '';
  }

  return `
<img src="${data.imagePath}">

<div class="info-box">
  ${birthAndDeath}
  <p class="person important">${data.name}</p>
</div>`;
};
