/**
 * @file Master slide “person”
 * @module baldr-master-person
 */

'use strict';

const {Media} = require('baldr-library');

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

function objPropertyIsString(object, property) {
  if (
    typeof object === 'object' &&
    object.hasOwnProperty(property) &&
    typeof object[property] === 'string'
  ) {
    return true;
  }
  else {
    return false;
  }
}

function objPropertyNotEmty(object, property) {
  if (
    typeof object === 'object' &&
    object.hasOwnProperty(property) &&
    object[property]
  ) {
    return true;
  }
  else {
    return false;
  }
}

/**
 *
 */
exports.normalizeData = function(rawSlideData, config) {
  let data = {};

  if (objPropertyIsString(rawSlideData, 'name')) {
    data.name = rawSlideData.name;
  }

  let images = new Media(config.sessionDir);
  let image = images.list(rawSlideData.image, 'image');
  if (image && image !== [] && image[0] && image[0].hasOwnProperty('path')) {
    data.imagePath = image[0].path;
  }

  if (objPropertyNotEmty(rawSlideData, 'birth')) {
    data.birth = '* ' + rawSlideData.birth;
  }
  else {
    data.birth = '';
  }

  if (objPropertyNotEmty(rawSlideData, 'death')) {
    data.death = '† ' + rawSlideData.death;
  }
  else {
    data.death = '';
  }

  if (data.hasOwnProperty('birth') || data.hasOwnProperty('death')) {
    data.birthAndDeath = true;
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
  <p class="person important">${data.name}</p>
  ${birthAndDeath}
</div>`;
};
